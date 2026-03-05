'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

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
  { name: 'Royal', primary: '#5B7CFF', secondary: '#7B61FF', text: '#FFFFFF' },
  { name: 'Night Neon', primary: '#00E5FF', secondary: '#7C3AED', text: '#E5FFFA' },
  { name: 'Gold Premium', primary: '#C8A951', secondary: '#F5E7B2', text: '#1F2937' },
  { name: 'Forest', primary: '#065F46', secondary: '#10B981', text: '#ECFDF5' },
  { name: 'Sunset', primary: '#F97316', secondary: '#EC4899', text: '#FFFFFF' },
];

type DesignForm = {
  title: string;
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

export default function TicketDesignStudioPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState<DesignForm>({
    title: 'Mon Événement',
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
  });

  const [imgError, setImgError] = useState(false);

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

        setForm((prev) => ({
          ...prev,
          title: event.title || 'Mon Événement',
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
        }));
      } catch (e: any) {
        setError(e.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };

    if (eventId) fetchEvent();
  }, [eventId]);

  const previewTitle = useMemo(
    () => form.ticketDesignCustomTitle?.trim() || 'Billet Officiel',
    [form.ticketDesignCustomTitle]
  );

  const previewStyle = {
    background: `linear-gradient(135deg, ${form.ticketDesignPrimaryColor}, ${form.ticketDesignSecondaryColor})`,
    color: form.ticketDesignTextColor,
  };

  const saveDesign = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const token = getToken();
      if (!token) throw new Error('Session expirée. Reconnectez-vous.');

      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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

      setSuccess('Design sauvegardé avec succès.');
      setTimeout(() => setSuccess(null), 2500);
    } catch (e: any) {
      setError(e.message || 'Erreur inconnue');
    } finally {
      setIsSaving(false);
    }
  };

  const resetDesign = () => {
    setForm((prev) => ({
      ...prev,
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
    }));
  };

  const inputCls =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href={`/dashboard/events/${eventId}/edit`} className="text-sm text-indigo-600 hover:text-indigo-700">
              ← Retour à l’événement
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">Studio Design Billet</h1>
            <p className="text-slate-500 text-sm">Prévisualisation en direct, fluide et professionnelle</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetDesign} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold">
              Reset
            </button>
            <button
              onClick={saveDesign}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold disabled:opacity-60"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 text-sm">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900 mb-4">Template</h2>
              <select
                className={inputCls}
                value={form.ticketDesignTemplate}
                onChange={(e) => setForm((p) => ({ ...p, ticketDesignTemplate: e.target.value }))}
              >
                {TEMPLATES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="font-bold text-slate-900 mb-4">Palette</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        ticketDesignPrimaryColor: preset.primary,
                        ticketDesignSecondaryColor: preset.secondary,
                        ticketDesignTextColor: preset.text,
                      }))
                    }
                    className="rounded-xl border border-slate-200 p-2 text-left text-xs"
                  >
                    <div className="h-6 rounded mb-1" style={{ background: `linear-gradient(90deg, ${preset.primary}, ${preset.secondary})` }} />
                    {preset.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="text-xs text-slate-600">
                  Primaire
                  <input type="color" className="w-full h-10 mt-1 rounded-lg border border-slate-200" value={form.ticketDesignPrimaryColor} onChange={(e) => setForm((p) => ({ ...p, ticketDesignPrimaryColor: e.target.value }))} />
                </label>
                <label className="text-xs text-slate-600">
                  Secondaire
                  <input type="color" className="w-full h-10 mt-1 rounded-lg border border-slate-200" value={form.ticketDesignSecondaryColor} onChange={(e) => setForm((p) => ({ ...p, ticketDesignSecondaryColor: e.target.value }))} />
                </label>
                <label className="text-xs text-slate-600">
                  Texte
                  <input type="color" className="w-full h-10 mt-1 rounded-lg border border-slate-200" value={form.ticketDesignTextColor} onChange={(e) => setForm((p) => ({ ...p, ticketDesignTextColor: e.target.value }))} />
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
              <h2 className="font-bold text-slate-900">Contenu</h2>
              <div>
                <label className="text-xs text-slate-600">Image de fond (URL)</label>
                <input
                  type="url"
                  className={inputCls}
                  value={form.ticketDesignBackgroundUrl}
                  onChange={(e) => {
                    setImgError(false);
                    setForm((p) => ({ ...p, ticketDesignBackgroundUrl: e.target.value }));
                  }}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Titre personnalisé</label>
                <input
                  className={inputCls}
                  value={form.ticketDesignCustomTitle}
                  onChange={(e) => setForm((p) => ({ ...p, ticketDesignCustomTitle: e.target.value }))}
                  placeholder="Billet VIP Premium"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600">Note de bas de billet</label>
                <input
                  className={inputCls}
                  value={form.ticketDesignFooterNote}
                  onChange={(e) => setForm((p) => ({ ...p, ticketDesignFooterNote: e.target.value }))}
                  placeholder="Non remboursable"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1">
                <label className="text-xs flex items-center gap-2">
                  <input type="checkbox" checked={form.ticketDesignShowQr} onChange={(e) => setForm((p) => ({ ...p, ticketDesignShowQr: e.target.checked }))} />
                  Afficher QR
                </label>
                <label className="text-xs flex items-center gap-2">
                  <input type="checkbox" checked={form.ticketDesignShowSeat} onChange={(e) => setForm((p) => ({ ...p, ticketDesignShowSeat: e.target.checked }))} />
                  Afficher siège
                </label>
                <label className="text-xs flex items-center gap-2">
                  <input type="checkbox" checked={form.ticketDesignShowTerms} onChange={(e) => setForm((p) => ({ ...p, ticketDesignShowTerms: e.target.checked }))} />
                  Afficher conditions
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <h2 className="font-bold text-slate-900 mb-4">Prévisualisation Live</h2>
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
              <div className="relative min-h-[260px] p-5" style={previewStyle}>
                {form.ticketDesignBackgroundUrl && !imgError && (
                  <img
                    src={form.ticketDesignBackgroundUrl}
                    alt="bg"
                    className="absolute inset-0 w-full h-full object-cover opacity-35"
                    onError={() => setImgError(true)}
                  />
                )}
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-wider opacity-90">{form.ticketDesignTemplate}</div>
                  <h3 className="text-2xl font-extrabold mt-1">{previewTitle}</h3>
                  <p className="text-sm opacity-90 mt-1">{form.title}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="opacity-80 text-xs">Date</div>
                      <div className="font-semibold">12 Avril 2026</div>
                    </div>
                    <div>
                      <div className="opacity-80 text-xs">Lieu</div>
                      <div className="font-semibold">Abidjan</div>
                    </div>
                    {form.ticketDesignShowSeat && (
                      <div>
                        <div className="opacity-80 text-xs">Siège</div>
                        <div className="font-semibold">A-12</div>
                      </div>
                    )}
                    {form.ticketDesignShowQr && (
                      <div>
                        <div className="opacity-80 text-xs">QR</div>
                        <div className="font-semibold">████</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {form.ticketDesignShowTerms && (
                <div className="px-5 py-3 text-xs text-slate-500 bg-slate-50 border-t border-slate-200">
                  {form.ticketDesignFooterNote?.trim() || 'Présentez ce billet à l’entrée. Merci.'}
                </div>
              )}
            </div>

            {imgError && (
              <p className="text-xs text-amber-600 mt-2">
                Image de fond inaccessible → fallback gradient automatiquement utilisé.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
