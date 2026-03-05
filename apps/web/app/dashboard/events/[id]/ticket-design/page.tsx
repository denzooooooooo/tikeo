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

type OngletStudio = 'style' | 'contenu' | 'mise_en_page' | 'typographie';

const MODELES = [
  { value: 'CLASSIC', label: 'Classique' },
  { value: 'NEON', label: 'Néon' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'LUXURY', label: 'Luxe' },
  { value: 'FESTIVE', label: 'Festif' },
  { value: 'CORPORATE', label: 'Corporate' },
];

const PRESETS_COULEURS = [
  { name: 'Bleu Royal', primary: '#5B7CFF', secondary: '#7B61FF', text: '#FFFFFF' },
  { name: 'Nuit Néon', primary: '#00E5FF', secondary: '#7C3AED', text: '#E6FFFA' },
  { name: 'Prestige Or', primary: '#C8A951', secondary: '#F8E7A0', text: '#111827' },
  { name: 'Émeraude', primary: '#047857', secondary: '#10B981', text: '#ECFDF5' },
  { name: 'Coucher de soleil', primary: '#F97316', secondary: '#EC4899', text: '#FFFFFF' },
  { name: 'Carbone', primary: '#111827', secondary: '#374151', text: '#F9FAFB' },
];

const POLICES = [
  { value: 'Inter, sans-serif', label: 'Inter (moderne)' },
  { value: 'Poppins, sans-serif', label: 'Poppins (arrondie)' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat (premium)' },
  { value: '"Playfair Display", serif', label: 'Playfair (élégante)' },
  { value: 'Oswald, sans-serif', label: 'Oswald (impact)' },
  { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet (lisible)' },
];

type FormDesign = {
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

  fontFamily: string;
  titleSize: number;
  contentSize: number;
  titleWeight: number;
  letterSpacing: number;

  overlayOpacity: number;
  borderRadius: number;
  shadowIntensity: 'soft' | 'medium' | 'strong';
};

const INITIAL_FORM: FormDesign = {
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

  fontFamily: 'Inter, sans-serif',
  titleSize: 34,
  contentSize: 14,
  titleWeight: 800,
  letterSpacing: 0.3,

  overlayOpacity: 0.3,
  borderRadius: 18,
  shadowIntensity: 'medium',
};

export default function TicketDesignStudioPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [onglet, setOnglet] = useState<OngletStudio>('style');
  const [previewMobile, setPreviewMobile] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pickerActif, setPickerActif] = useState<'primary' | 'secondary' | 'text' | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  const [form, setForm] = useState<FormDesign>(INITIAL_FORM);
  const [history, setHistory] = useState<FormDesign[]>([INITIAL_FORM]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const previewRef = useRef<HTMLDivElement>(null);

  const pushHistory = (next: FormDesign) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const merged = [...sliced, next].slice(-80);
      return merged;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 79));
  };

  const updateForm = (patch: Partial<FormDesign>) => {
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

        const loaded: FormDesign = {
          ...INITIAL_FORM,
          title: event.title || INITIAL_FORM.title,
          venueCity: event.venueCity || INITIAL_FORM.venueCity,
          ticketDesignTemplate: event.ticketDesignTemplate || INITIAL_FORM.ticketDesignTemplate,
          ticketDesignBackgroundUrl: event.ticketDesignBackgroundUrl || '',
          ticketDesignPrimaryColor: event.ticketDesignPrimaryColor || INITIAL_FORM.ticketDesignPrimaryColor,
          ticketDesignSecondaryColor: event.ticketDesignSecondaryColor || INITIAL_FORM.ticketDesignSecondaryColor,
          ticketDesignTextColor: event.ticketDesignTextColor || INITIAL_FORM.ticketDesignTextColor,
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
      setOnglet('contenu');
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

      setSuccess('Design sauvegardé avec succès ✨');
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

  const displayTitle = useMemo(
    () => form.ticketDesignCustomTitle?.trim() || 'Billet Officiel',
    [form.ticketDesignCustomTitle]
  );

  const shadowClass =
    form.shadowIntensity === 'soft'
      ? 'shadow-lg'
      : form.shadowIntensity === 'strong'
        ? 'shadow-2xl'
        : 'shadow-xl';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 text-slate-900">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/dashboard/events/${eventId}/edit`} className="text-indigo-600 hover:text-indigo-700 text-sm">
              ← Retour à l’édition de l’événement
            </Link>
            <h1 className="text-2xl md:text-4xl font-black mt-2 tracking-tight">Studio de design de billet — Premium</h1>
            <p className="text-slate-500 text-sm mt-1">Personnalisation avancée : couleurs, typographie, mise en page, export.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={undo} disabled={historyIndex <= 0} className="px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-40">Annuler</button>
            <button onClick={redo} disabled={historyIndex >= history.length - 1} className="px-3 py-2 rounded-xl border border-slate-300 bg-white disabled:opacity-40">Rétablir</button>
            <button onClick={resetAll} className="px-3 py-2 rounded-xl border border-slate-300 bg-white">Réinitialiser</button>
            <button onClick={exportPreview} disabled={isExporting} className="px-3 py-2 rounded-xl bg-white border border-slate-300">
              {isExporting ? 'Export...' : 'Exporter PNG'}
            </button>
            <button onClick={saveDesign} disabled={isSaving} className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold">
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">{success}</div>}

        <div className="grid grid-cols-1 xl:grid-cols-[430px_1fr] gap-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <div className="grid grid-cols-4 gap-2 mb-4">
              {([
                { key: 'style', label: 'Style' },
                { key: 'contenu', label: 'Contenu' },
                { key: 'mise_en_page', label: 'Mise en page' },
                { key: 'typographie', label: 'Police' },
              ] as { key: OngletStudio; label: string }[]).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setOnglet(t.key)}
                  className={`px-2 py-2 rounded-lg text-xs font-semibold border ${
                    onglet === t.key
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {onglet === 'style' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">Modèle</label>
                  <select className={inputCls} value={form.ticketDesignTemplate} onChange={(e) => updateForm({ ticketDesignTemplate: e.target.value })}>
                    {MODELES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500">Presets de couleurs</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {PRESETS_COULEURS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() =>
                          updateForm({
                            ticketDesignPrimaryColor: preset.primary,
                            ticketDesignSecondaryColor: preset.secondary,
                            ticketDesignTextColor: preset.text,
                          })
                        }
                        className="rounded-xl border border-slate-200 p-2 text-left bg-white"
                      >
                        <div className="h-6 rounded mb-1" style={{ background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})` }} />
                        <div className="text-xs text-slate-700">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs text-slate-500">Couleurs avancées</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['primary', 'secondary', 'text'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setPickerActif(type)}
                        className="rounded-xl border border-slate-200 p-2 text-xs bg-white"
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
                        {type === 'primary' ? 'Primaire' : type === 'secondary' ? 'Secondaire' : 'Texte'}
                      </button>
                    ))}
                  </div>

                  {pickerActif && (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <HexColorPicker
                        color={
                          pickerActif === 'primary'
                            ? form.ticketDesignPrimaryColor
                            : pickerActif === 'secondary'
                              ? form.ticketDesignSecondaryColor
                              : form.ticketDesignTextColor
                        }
                        onChange={(color) =>
                          updateForm(
                            pickerActif === 'primary'
                              ? { ticketDesignPrimaryColor: color }
                              : pickerActif === 'secondary'
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

            {onglet === 'contenu' && (
              <div className="space-y-4">
                <div
                  {...getRootProps()}
                  className={`rounded-xl border-2 border-dashed p-4 text-center cursor-pointer ${
                    isDragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <p className="text-sm text-slate-700">Glissez-déposez une image de fond ou cliquez pour uploader</p>
                  <p className="text-xs text-slate-500 mt-1">JPG / PNG / WebP</p>
                </div>

                <div>
                  <label className="text-xs text-slate-500">URL image de fond (optionnel)</label>
                  <input
                    className={inputCls}
                    value={form.ticketDesignBackgroundUrl}
                    onChange={(e) => {
                      setImageError(false);
                      updateForm({ ticketDesignBackgroundUrl: e.target.value });
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Titre du billet</label>
                  <input className={inputCls} value={form.ticketDesignCustomTitle} onChange={(e) => updateForm({ ticketDesignCustomTitle: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Note en bas du billet</label>
                  <input className={inputCls} value={form.ticketDesignFooterNote} onChange={(e) => updateForm({ ticketDesignFooterNote: e.target.value })} />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Intensité overlay image ({Math.round(form.overlayOpacity * 100)}%)</label>
                  <input
                    type="range"
                    min={0}
                    max={0.8}
                    step={0.01}
                    value={form.overlayOpacity}
                    onChange={(e) => updateForm({ overlayOpacity: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {onglet === 'mise_en_page' && (
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
                    Afficher conditions de bas de billet
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <label className="text-xs text-slate-500">Mode de prévisualisation</label>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => setPreviewMobile(false)}
                      className={`px-3 py-1.5 rounded-lg text-xs border ${!previewMobile ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-300 text-slate-500 bg-white'}`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMobile(true)}
                      className={`px-3 py-1.5 rounded-lg text-xs border ${previewMobile ? 'border-indigo-300 text-indigo-700 bg-indigo-50' : 'border-slate-300 text-slate-500 bg-white'}`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-500">Zoom : {Math.round(zoom * 100)}%</label>
                  <input type="range" min={0.7} max={1.3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Rayon des coins : {form.borderRadius}px</label>
                  <input type="range" min={6} max={34} step={1} value={form.borderRadius} onChange={(e) => updateForm({ borderRadius: Number(e.target.value) })} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Ombre</label>
                  <select className={inputCls} value={form.shadowIntensity} onChange={(e) => updateForm({ shadowIntensity: e.target.value as FormDesign['shadowIntensity'] })}>
                    <option value="soft">Douce</option>
                    <option value="medium">Moyenne</option>
                    <option value="strong">Forte</option>
                  </select>
                </div>
              </div>
            )}

            {onglet === 'typographie' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500">Police</label>
                  <select className={inputCls} value={form.fontFamily} onChange={(e) => updateForm({ fontFamily: e.target.value })}>
                    {POLICES.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-500">Taille du titre : {form.titleSize}px</label>
                  <input type="range" min={24} max={56} step={1} value={form.titleSize} onChange={(e) => updateForm({ titleSize: Number(e.target.value) })} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Taille du contenu : {form.contentSize}px</label>
                  <input type="range" min={11} max={22} step={1} value={form.contentSize} onChange={(e) => updateForm({ contentSize: Number(e.target.value) })} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Épaisseur du titre : {form.titleWeight}</label>
                  <input type="range" min={500} max={900} step={100} value={form.titleWeight} onChange={(e) => updateForm({ titleWeight: Number(e.target.value) })} className="w-full" />
                </div>

                <div>
                  <label className="text-xs text-slate-500">Espacement des lettres : {form.letterSpacing.toFixed(1)}px</label>
                  <input type="range" min={0} max={4} step={0.1} value={form.letterSpacing} onChange={(e) => updateForm({ letterSpacing: Number(e.target.value) })} className="w-full" />
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6">
            <div className="text-sm text-slate-500 mb-3">Prévisualisation en temps réel</div>
            <div className={`mx-auto transition-all ${previewMobile ? 'max-w-[360px]' : 'max-w-[760px]'}`}>
              <motion.div
                key={`${form.ticketDesignTemplate}-${form.ticketDesignPrimaryColor}-${form.ticketDesignSecondaryColor}-${form.ticketDesignTextColor}-${form.fontFamily}-${form.titleSize}-${form.contentSize}-${form.titleWeight}-${form.letterSpacing}`}
                initial={{ opacity: 0.65, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
              >
                <div ref={previewRef} className={`overflow-hidden border border-slate-200 ${shadowClass}`} style={{ borderRadius: `${form.borderRadius}px` }}>
                  <div
                    className="relative p-6 md:p-8 min-h-[280px]"
                    style={{
                      background: `linear-gradient(135deg, ${form.ticketDesignPrimaryColor}, ${form.ticketDesignSecondaryColor})`,
                      color: form.ticketDesignTextColor,
                      fontFamily: form.fontFamily,
                    }}
                  >
                    {form.ticketDesignBackgroundUrl && !imageError && (
                      <img
                        src={form.ticketDesignBackgroundUrl}
                        alt="background"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ opacity: form.overlayOpacity }}
                        onError={() => setImageError(true)}
                      />
                    )}
                    <div className="relative z-10">
                      <div
                        className="uppercase opacity-90"
                        style={{ letterSpacing: `${Math.max(form.letterSpacing, 0.2)}px`, fontSize: `${Math.max(form.contentSize - 2, 10)}px` }}
                      >
                        {form.ticketDesignTemplate}
                      </div>
                      <h3
                        className="mt-2"
                        style={{
                          fontSize: `${form.titleSize}px`,
                          fontWeight: form.titleWeight,
                          letterSpacing: `${form.letterSpacing}px`,
                          lineHeight: 1.1,
                        }}
                      >
                        {displayTitle}
                      </h3>
                      <p className="mt-1 opacity-90" style={{ fontSize: `${form.contentSize}px` }}>{form.title}</p>

                      <div className="mt-6 grid grid-cols-2 gap-3" style={{ fontSize: `${form.contentSize}px` }}>
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
                    <div className="px-5 py-3 text-xs text-slate-600 bg-slate-50 border-t border-slate-200" style={{ fontFamily: form.fontFamily }}>
                      {form.ticketDesignFooterNote?.trim() || 'Merci de présenter ce billet à l’entrée.'}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            {imageError && <p className="text-xs text-amber-600 mt-3">Image non accessible : fallback gradient actif.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
