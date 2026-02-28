'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { API_CONFIG } from '@tikeo/utils';

const API_URL = API_CONFIG.BASE_URL;

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch { return null; }
}

const CATEGORIES = [
  'Musique', 'Festival', 'Sport', 'Conférence', 'Exposition',
  'Gastronomie', 'Famille', 'Théâtre', 'Cinéma', 'Autre',
];

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    venueName: '',
    venueAddress: '',
    venueCity: '',
    venueCountry: '',
    venuePostalCode: '',
    isOnline: false,
    streamingUrl: '',
    coverImage: '',
    capacity: '',
    visibility: 'PUBLIC',
  });

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
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
      if (!res.ok) throw new Error('Événement introuvable');
      const event = await res.json();

      // Format dates for datetime-local input
      const formatDate = (d: string) => {
        if (!d) return '';
        return new Date(d).toISOString().slice(0, 16);
      };

      setForm({
        title: event.title || '',
        description: event.description || '',
        category: event.category || '',
        startDate: formatDate(event.startDate),
        endDate: formatDate(event.endDate),
        venueName: event.venueName || '',
        venueAddress: event.venueAddress || '',
        venueCity: event.venueCity || '',
        venueCountry: event.venueCountry || '',
        venuePostalCode: event.venuePostalCode || '',
        isOnline: event.isOnline || false,
        streamingUrl: event.streamingUrl || '',
        coverImage: event.coverImage || '',
        capacity: String(event.capacity || ''),
        visibility: event.visibility || 'PUBLIC',
      });
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const handleChange = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = getToken();
      const payload = {
        ...form,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
      };

      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Erreur lors de la mise à jour');
      }

      setSuccess(true);
      setTimeout(() => router.push('/dashboard/events'), 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white transition-all';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de l'événement…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/dashboard/events" className="text-white/70 text-sm hover:text-white mb-2 inline-flex items-center gap-1">
            ← Mes événements
          </Link>
          <h1 className="text-3xl font-bold text-white">Modifier l'événement</h1>
          <p className="text-white/80 mt-1">Mettez à jour les informations de votre événement</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold">
            ✅ Événement mis à jour avec succès ! Redirection…
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">📋 Informations générales</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Titre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={inputCls}
                  placeholder="Nom de votre événement"
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={`${inputCls} min-h-[120px] resize-y`}
                  placeholder="Décrivez votre événement…"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Catégorie <span className="text-red-500">*</span></label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className={inputCls}
                    required
                  >
                    <option value="">Sélectionner…</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Visibilité</label>
                  <select
                    value={form.visibility}
                    onChange={(e) => handleChange('visibility', e.target.value)}
                    className={inputCls}
                  >
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Privé</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Image de couverture (URL)</label>
                <input
                  type="url"
                  value={form.coverImage}
                  onChange={(e) => handleChange('coverImage', e.target.value)}
                  className={inputCls}
                  placeholder="https://…"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">📅 Dates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date de début <span className="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  value={form.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
              <div>
                <label className={labelCls}>Date de fin <span className="text-red-500">*</span></label>
                <input
                  type="datetime-local"
                  value={form.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className={inputCls}
                  required
                />
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">📍 Lieu</h2>
            <div className="mb-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isOnline}
                  onChange={(e) => handleChange('isOnline', e.target.checked)}
                  className="w-4 h-4 accent-[#5B7CFF]"
                />
                <span className="text-sm font-medium text-gray-700">Événement en ligne</span>
              </label>
            </div>
            {form.isOnline ? (
              <div>
                <label className={labelCls}>Lien de streaming</label>
                <input
                  type="url"
                  value={form.streamingUrl}
                  onChange={(e) => handleChange('streamingUrl', e.target.value)}
                  className={inputCls}
                  placeholder="https://…"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Nom du lieu <span className="text-red-500">*</span></label>
                  <input type="text" value={form.venueName} onChange={(e) => handleChange('venueName', e.target.value)} className={inputCls} placeholder="Salle, stade, parc…" required={!form.isOnline} />
                </div>
                <div>
                  <label className={labelCls}>Adresse</label>
                  <input type="text" value={form.venueAddress} onChange={(e) => handleChange('venueAddress', e.target.value)} className={inputCls} placeholder="Rue, numéro…" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Ville <span className="text-red-500">*</span></label>
                    <input type="text" value={form.venueCity} onChange={(e) => handleChange('venueCity', e.target.value)} className={inputCls} placeholder="Abidjan" required={!form.isOnline} />
                  </div>
                  <div>
                    <label className={labelCls}>Pays <span className="text-red-500">*</span></label>
                    <input type="text" value={form.venueCountry} onChange={(e) => handleChange('venueCountry', e.target.value)} className={inputCls} placeholder="Côte d'Ivoire" required={!form.isOnline} />
                  </div>
                  <div>
                    <label className={labelCls}>Code postal</label>
                    <input type="text" value={form.venuePostalCode} onChange={(e) => handleChange('venuePostalCode', e.target.value)} className={inputCls} placeholder="00000" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Capacité */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">🎟️ Capacité</h2>
            <div>
              <label className={labelCls}>Nombre de places</label>
              <input
                type="number"
                value={form.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                className={inputCls}
                min="1"
                placeholder="100"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/dashboard/events"
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Enregistrement…
                </>
              ) : (
                '💾 Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
