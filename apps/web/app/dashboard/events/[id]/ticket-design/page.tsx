'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HexColorPicker } from 'react-colorful';
import { useDropzone } from 'react-dropzone';
import { toPng } from 'html-to-image';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch {
    return null;
  }
}

type StudioTab = 'style' | 'content' | 'layout';

const TEMPLATES = [
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'NEON', label: 'Neon' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'FESTIVE', label: 'Festive' },
  { value: 'CORPORATE', label: 'Corporate' },
];

const COLOR_PRESETS = [
  { name: 'Royal Blue', primary: '#5B7CFF', secondary: '#7B61FF', text: '#FFFFFF' },
  { name: 'Neon Night', primary: '#00E5FF', secondary: '#7C3AED', text: '#E6FFFA' },
  { name: 'Gold Prestige', primary: '#C8A951', secondary: '#F8E7A0', text: '#111827' },
  { name: 'Emerald', primary: '#047857', secondary: '#10B981', text: '#ECFDF5' },
  { name: 'Sunset', primary: '#F97316', secondary: '#EC4899', text: '#FFFFFF' },
  { name: 'Carbon', primary: '#111827', secondary: '#374151', text: '#F9FAFB' },
];

type DesignForm = {
  title: string;
  venueCity: string;
  ticketDesignTemplate: string;
  ticketDesignBackgroundUrl: string;
  ticketDesignPrimaryColor: string;
  ticketDesignSecondaryColor: string;
  ticketDesignTextColor: string;
  ticketDesignCustomTitle: string;
  ticketDesignFooterNote: string;
  ticketDesignShowQr: boolean;
  ticketDesignShowSeat: boolean;
  ticketDesignShowTerms: boolean;
};

const INITIAL_FORM: DesignForm = {
  title: 'Mon Événement',
  venueCity: 'Abidjan',
  ticketDesignTemplate: 'CLASSIC',
  ticketDesignBackgroundUrl: '',
  ticketDesignPrimaryColor: '#5B7CFF',
  ticketDesignSecondaryColor: '#7B61FF',
  ticketDesignTextColor: '#FFFFFF',
  ticketDesignCustomTitle: '',
  ticketDesignFooterNote: '',
  ticketDesignShowQr: true,
  ticketDesignShowSeat: true,
  ticketDesignShowTerms: true,
};

export default function TicketDesignStudioPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [tab, setTab] = useState<StudioTab>('style');
  const [mobilePreview, setMobilePreview] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [activePicker, setActivePicker] = useState<'primary' | 'secondary' | 'text' | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [form, setForm] = useState<DesignForm>(INITIAL_FORM);
  const [history, setHistory] = useState<DesignForm[]>([INITIAL_FORM]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);

  const pushHistory = (next: DesignForm) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const merged = [...sliced, next].slice(-50);
      return merged;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 49));
  };

  const updateForm = (patch: Partial<DesignForm>) => {
    setForm((prev) => {
      const next = { ...prev, ...patch };
      pushHistory(next);
      return next;
    });
  };

  const undo = () => {
    setHistoryIndex((idx) => {
      const nextIdx = Math.max(0, idx - 1);
      setForm(history[nextIdx] || history[0]);
      return nextIdx;
    });
  };

  const redo = () => {
    setHistoryIndex((idx) => {
      const nextIdx = Math.min(history.length - 1, idx + 1);
      setForm(history[nextIdx] || history[history.length - 1]);
      return nextIdx;
    });
  };

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}/events/${eventId}`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error('Impossible de charger l’événement');

        const event = await res.json();

        const loaded: DesignForm = {
          title: event.title || 'Mon Événement',
          venueCity: event.venueCity || 'Abidjan',
          ticketDesignTemplate: event.ticketDesignTemplate || 'CLASSIC',
          ticketDesignBackgroundUrl: event.ticketDesignBackgroundUrl || '',
          ticketDesignPrimaryColor: event.ticketDesignPrimaryColor || '#5B7CFF',
          ticketDesignSecondaryColor: event.ticketDesignSecondaryColor || '#7B61FF',
          ticketDesignTextColor: event.ticketDesignTextColor || '#FFFFFF',
          ticketDesignCustomTitle: event.ticketDesignCustomTitle || '',
          ticketDesignFooterNote: event.ticketDesignFooterNote || '',
          ticketDesignShowQr: event.ticketDesignShowQr ?? true,
          ticketDesignShowSeat: event.ticketDesignShowSeat ?? true,
          ticketDesignShowTerms: event.ticketDesignShowTerms ?? true,
        };

        setForm(loaded);
        setHistory([loaded]);
        setHistoryIndex(0);
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageError(false);
      updateForm({ ticketDesignBackgroundUrl: String(reader.result || '') });
      setTab('content');
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const saveDesign = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const token = getToken();
      if (!token) throw new Error('Session expirée, reconnectez-vous.');

      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ticketDesignTemplate: form.ticketDesignTemplate,
          ticketDesignBackgroundUrl: form.ticketDesignBackgroundUrl || undefined,
          ticketDesignPrimaryColor: form.ticketDesignPrimaryColor,
          ticketDesignSecondaryColor: form.ticketDesignSecondaryColor,
          ticketDesignTextColor: form.ticketDesignTextColor,
          ticketDesignCustomTitle: form.ticketDesignCustomTitle || undefined,
          ticketDesignFooterNote: form.ticketDesignFooterNote || undefined,
          ticketDesignShowQr: form.ticketDesignShowQr,
          ticketDesignShowSeat: form.ticketDesignShowSeat,
          ticketDesignShowTerms: form.ticketDesignShowTerms,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Échec de sauvegarde');
      }

      setSuccess('Studio sauvegardé avec succès ✨');
      setTimeout(() => setSuccess(null), 2500);
    } catch (e: any) {
      setError(e.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const exportPreview = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);
    try {
      const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `ticket-design-${eventId}.png`;
      link.href = dataUrl;
      link.click();
      setSuccess('Aperçu exporté en PNG');
      setTimeout(() => setSuccess(null), 2000);
    } catch {
      setError('Export impossible pour le moment.');
    } finally {
      setIsExporting(false);
    }
  };

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setHistory([INITIAL_FORM]);
    setHistoryIndex(0);
    setImageError(false);
  };

  const displayTitle = useMemo(() => form.ticketDesignCustomTitle?.trim() || 'Billet Officiel', [form.ticketDesignCustomTitle]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls = 'w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-slate-100 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/dashboard/events/${eventId}/edit`} className="text-cyan-300 hover:text-cyan-200 text-sm">
              ← Retour à l’édition événement
            </Link>
            <h1 className="text-2xl md:text-4xl font-black mt-2 tracking-tight">Ticket Design Studio — Premium</h1>
            <p className="text-slate-400 text-sm mt-1">Live preview, animation, export, undo/redo, upload visuel</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="px-3 py-2 rounded-xl border border-slate-700 disabled:opacity-40">Undo</button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="px-3 py-2 rounded-xl border border-slate-700 disabled:opacity-40">Redo</button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl border border-slate-700">Reset</button>
            <button onClick={exportPreview} disabled={isExporting} className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
              {isExporting ? 'Export...' : 'Exporter PNG'}
            </button>
            <button onClick={saveDesign} disabled={isSaving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 font-semibold">
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>}
        {success && <div className="mb-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-emerald-300">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur p-4 md:p-5">
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(['style', 'content', 'layout'] as StudioTab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border ${tab === t ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-slate-900 border-slate-700 text-slate-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === 'style' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-400">Template</label>
                  <select className={inputCls} value={form.ticketDesignTemplate} onChange={(e) => updateForm({ ticketDesignTemplate: e.target.value })}>
                    {TEMPLATES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Presets couleurs</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {COLOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => updateForm({ ticketDesignPrimaryColor: preset.primary, ticketDesignSecondaryColor: preset.secondary, ticketDesignTextColor: preset.text })}
                        className="rounded-xl border border-slate-700 p-2 text-left"
                      >
                        <div className="h-6 rounded mb-1" style={{ background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})` }} />
                        <div className="text-xs">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-400">Couleurs avancées</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['primary', 'secondary', 'text'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setActivePicker(type)}
                        className="rounded-xl border border-slate-700 p-2 text-xs"
                      >
                        <div
                          className="h-7 rounded mb-1"
                          style={{
                            background:
                              type === 'primary'
                                ? form.ticketDesignPrimaryColor
                                : type === 'secondary'
                                  ? form.ticketDesignSecondaryColor
                                  : form.ticketDesignTextColor,
                          }}
                        />
                        {type}
                      </button>
                    ))}
                  </div>

                  {activePicker && (
                    <div className="p-3 rounded-xl border border-slate-700 bg-slate-950">
                      <HexColorPicker
                        color={
                          activePicker === 'primary'
                            ? form.ticketDesignPrimaryColor
                            : activePicker === 'secondary'
                              ? form.ticketDesignSecondaryColor
                              : form.ticketDesignTextColor
                        }
                        onChange={(color) =>
                          updateForm(
                            activePicker === 'primary'
                              ? { ticketDesignPrimaryColor: color }
                              : activePicker === 'secondary'
                                ? { ticketDesignSecondaryColor: color }
                                : { ticketDesignTextColor: color }
                          )
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'content' && (
              <div className="space-y-4">
                <div {...getRootProps()} className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer ${isDragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-slate-700 bg-slate-900'}`}>
                  <input {...getInputProps()} />
                  <p className="text-sm text-slate-300">Glissez-déposez une image de fond ou cliquez pour uploader</p>
                  <p className="text-xs text-slate-500 mt-1">JPG / PNG / WebP</p>
                </div>

                <div>
                  <label className="text-xs text-slate-400">URL image fond (optionnel)</label>
                  <input className={inputCls} value={form.ticketDesignBackgroundUrl} onChange={(e) => { setImageError(false); updateForm({ ticketDesignBackgroundUrl: e.target.value }); }} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Titre billet</label>
                  <input className={inputCls} value={form.ticketDesignCustomTitle} onChange={(e) => updateForm({ ticketDesignCustomTitle: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Note footer</label>
                  <input className={inputCls} value={form.ticketDesignFooterNote} onChange={(e) => updateForm({ ticketDesignFooterNote: e.target.value })} />
                </div>
              </div>
            )}

            {tab === 'layout' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.ticketDesignShowQr} onChange={(e) => updateForm({ ticketDesignShowQr: e.target.checked })} />
                    Afficher QR Code
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.ticketDesignShowSeat} onChange={(e) => updateForm({ ticketDesignShowSeat: e.target.checked })} />
                    Afficher bloc siège
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.ticketDesignShowTerms} onChange={(e) => updateForm({ ticketDesignShowTerms: e.target.checked })} />
                    Afficher conditions footer
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <label className="text-xs text-slate-400">Mode preview</label>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => setMobilePreview(false)} className={`px-3 py-1.5 rounded-lg text-xs border ${!mobilePreview ? 'border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-400'}`}>Desktop</button>
                    <button onClick={() => setMobilePreview(true)} className={`px-3 py-1.5 rounded-lg text-xs border ${mobilePreview ? 'border-cyan-400 text-cyan-200' : 'border-slate-700 text-slate-400'}`}>Mobile</button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400">Zoom: {Math.round(zoom * 100)}%</label>
                  <input type="range" min={0.7} max={1.3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
            <div className="text-sm text-slate-400 mb-3">Aperçu temps réel</div>
            <div className={`mx-auto transition-all ${mobilePreview ? 'max-w-[360px]' : 'max-w-[760px]'}`}>
              <motion.div
                key={`${form.ticketDesignTemplate}-${form.ticketDesignPrimaryColor}-${form.ticketDesignSecondaryColor}-${form.ticketDesignTextColor}`}
                initial={{ opacity: 0.5, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <div ref={previewRef} className="rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                  <div
                    className="relative p-6 md:p-8 min-h-[280px]"
                    style={{
                      background: `linear-gradient(135deg, ${form.ticketDesignPrimaryColor}, ${form.ticketDesignSecondaryColor})`,
                      color: form.ticketDesignTextColor,
                    }}
                  >
                    {form.ticketDesignBackgroundUrl && !imageError && (
                      <img
                        src={form.ticketDesignBackgroundUrl}
                        alt="background"
                        className="absolute inset-0 w-full h-full object-cover opacity-30"
                        onError={() => setImageError(true)}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="text-xs uppercase tracking-[0.2em] opacity-90">{form.ticketDesignTemplate}</div>
                      <h3 className="text-2xl md:text-3xl font-black mt-2">{displayTitle}</h3>
                      <p className="opacity-90 mt-1">{form.title}</p>

                      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="opacity-70 text-xs">Date</div>
                          <div className="font-bold">12 Avril 2026</div>
                        </div>
                        <div>
                          <div className="opacity-70 text-xs">Ville</div>
                          <div className="font-bold">{form.venueCity || 'Abidjan'}</div>
                        </div>
                        {form.ticketDesignShowSeat && (
                          <div>
                            <div className="opacity-70 text-xs">Siège</div>
                            <div className="font-bold">A-12</div>
                          </div>
                        )}
                        {form.ticketDesignShowQr && (
                          <div>
                            <div className="opacity-70 text-xs">QR</div>
                            <div className="font-bold tracking-widest">▦▦▦▦</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {form.ticketDesignShowTerms && (
                    <div className="px-5 py-3 text-xs text-slate-300 bg-slate-950 border-t border-slate-700">
                      {form.ticketDesignFooterNote?.trim() || 'Merci de présenter ce billet à l’entrée.'}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            {imageError && <p className="text-xs text-amber-400 mt-3">Image non accessible : fallback gradient activé.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
