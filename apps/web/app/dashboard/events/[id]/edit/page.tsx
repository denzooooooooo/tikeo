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

const CURRENCIES = [
  { code: 'XOF', label: 'FCFA (XOF)' },
  { code: 'XAF', label: 'FCFA (XAF)' },
  { code: 'EUR', label: 'Euro (€)' },
  { code: 'USD', label: 'Dollar ($)' },
  { code: 'NGN', label: 'Naira (₦)' },
  { code: 'GHS', label: 'Cedi (GH₵)' },
  { code: 'ZAR', label: 'Rand (R)' },
  { code: 'MAD', label: 'Dirham (MAD)' },
  { code: 'GNF', label: 'Franc guinéen (GNF)' },
  { code: 'CAD', label: 'Dollar canadien (CAD)' },
];

const CURRENCY_LABELS: Record<string, string> = {
  XOF: 'FCFA', XAF: 'FCFA', NGN: '₦', GHS: 'GH₵',
  ZAR: 'R', MAD: 'MAD', GNF: 'GNF', CDF: 'FC',
  EUR: '€', USD: '$', CAD: 'CAD', CHF: 'CHF',
};

interface TicketType {
  id?: string;
  name: string;
  description: string;
  price: string;
  quantity: string;
  salesStart?: string;
  salesEnd?: string;
  minPerOrder?: string;
  maxPerOrder?: string;
  isActive?: boolean;
}

type TabId = 'general' | 'venue' | 'tickets' | 'settings';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${checked ? 'bg-[#5B7CFF]' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
    </div>
  );
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('general');

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
    status: 'DRAFT',
    currency: 'XOF',
    tags: '',
    isFree: false,
  });

  const [tickets, setTickets] = useState<TicketType[]>([
    { name: '', description: '', price: '0', quantity: '100', minPerOrder: '1', maxPerOrder: '10' },
  ]);

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

      const formatDate = (d: string) => {
        if (!d) return '';
        return new Date(d).toISOString().slice(0, 16);
      };

      const minPrice = event.minPrice ?? 0;
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
        status: event.status || 'DRAFT',
        currency: event.currency || 'XOF',
        tags: typeof event.tags === 'string' ? event.tags.replace(/,/g, ', ') : '',
        isFree: minPrice === 0,
      });

      if (event.ticketTypes && event.ticketTypes.length > 0) {
        setTickets(
          event.ticketTypes.map((tt: any) => ({
            id: tt.id,
            name: tt.name || '',
            description: tt.description || '',
            price: String(tt.price ?? 0),
            quantity: String(tt.quantity ?? 100),
            salesStart: tt.salesStart ? formatDate(tt.salesStart) : '',
            salesEnd: tt.salesEnd ? formatDate(tt.salesEnd) : '',
            minPerOrder: String(tt.minPerOrder ?? 1),
            maxPerOrder: String(tt.maxPerOrder ?? 10),
            isActive: tt.isActive !== false,
          }))
        );
      }
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

  const handleTicketUpdate = (i: number, field: keyof TicketType, value: string) => {
    setTickets((prev) => prev.map((t, idx) => idx === i ? { ...t, [field]: value } : t));
  };

  const handleAddTicket = () => {
    setTickets((prev) => [
      ...prev,
      { name: '', description: '', price: '0', quantity: '100', minPerOrder: '1', maxPerOrder: '10' },
    ]);
  };

  const handleRemoveTicket = (i: number) => {
    if (tickets.length <= 1) return;
    setTickets((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const token = getToken();

      const validTickets = tickets.filter((t) => t.name.trim());
      const ticketTypesPayload = validTickets.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description || '',
        price: form.isFree ? 0 : (parseFloat(t.price) || 0),
        quantity: parseInt(t.quantity) || 100,
        available: parseInt(t.quantity) || 100,
        salesStart: t.salesStart
          ? new Date(t.salesStart).toISOString()
          : new Date().toISOString(),
        salesEnd: t.salesEnd
          ? new Date(t.salesEnd).toISOString()
          : new Date(form.endDate || Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        minPerOrder: parseInt(t.minPerOrder || '1') || 1,
        maxPerOrder: parseInt(t.maxPerOrder || '10') || 10,
        isActive: t.isActive !== false,
      }));

      const prices = ticketTypesPayload.map((t) => t.price);
      const minPrice = form.isFree ? 0 : (prices.length > 0 ? Math.min(...prices) : 0);
      const maxPrice = form.isFree ? 0 : (prices.length > 0 ? Math.max(...prices) : 0);

      const tagsValue = form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean).join(',')
        : '';

      const payload: any = {
        title: form.title,
        description: form.description,
        category: form.category,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        venueName: form.isOnline ? 'En ligne' : form.venueName,
        venueAddress: form.isOnline ? '' : form.venueAddress,
        venueCity: form.isOnline ? 'En ligne' : form.venueCity,
        venueCountry: form.isOnline ? 'En ligne' : form.venueCountry,
        venuePostalCode: form.isOnline ? '' : form.venuePostalCode,
        isOnline: form.isOnline,
        streamingUrl: form.isOnline ? form.streamingUrl : undefined,
        coverImage: form.coverImage,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        visibility: form.visibility,
        status: form.status,
        currency: form.currency,
        tags: tagsValue || undefined,
        minPrice,
        maxPrice,
        ticketTypes: ticketTypesPayload,
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
  const currencyLabel = CURRENCY_LABELS[form.currency] ?? form.currency;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'general', label: '📋 Général' },
    { id: 'venue', label: '📍 Lieu & Dates' },
    { id: 'tickets', label: '🎟️ Billets' },
    { id: 'settings', label: '⚙️ Paramètres' },
  ];

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

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-2xl border border-gray-200 p-1.5 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-max px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── TAB: GÉNÉRAL ── */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">📋 Informations générales</h2>

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
                  className={`${inputCls} min-h-[140px] resize-y`}
                  placeholder="Décrivez votre événement en détail…"
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
                  <label className={labelCls}>Devise</label>
                  <select
                    value={form.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className={inputCls}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
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
                {form.coverImage && (
                  <div className="mt-2 rounded-xl overflow-hidden h-40 bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.coverImage}
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className={labelCls}>Tags (séparés par des virgules)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleChange('tags', e.target.value)}
                  className={inputCls}
                  placeholder="musique, concert, live, afrobeat…"
                />
                <p className="text-xs text-gray-400 mt-1">Les tags améliorent la visibilité dans les recherches.</p>
              </div>
            </div>
          )}

          {/* ── TAB: LIEU & DATES ── */}
          {activeTab === 'venue' && (
            <div className="space-y-6">
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

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">📍 Lieu</h2>
                <div className="mb-4 flex items-center gap-3">
                  <Toggle checked={form.isOnline} onChange={() => handleChange('isOnline', !form.isOnline)} />
                  <span className="text-sm font-medium text-gray-700">Événement en ligne</span>
                </div>

                {form.isOnline ? (
                  <div>
                    <label className={labelCls}>Lien de streaming</label>
                    <input
                      type="url"
                      value={form.streamingUrl}
                      onChange={(e) => handleChange('streamingUrl', e.target.value)}
                      className={inputCls}
                      placeholder="https://zoom.us/… ou https://youtube.com/…"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className={labelCls}>Nom du lieu <span className="text-red-500">*</span></label>
                      <input type="text" value={form.venueName} onChange={(e) => handleChange('venueName', e.target.value)} className={inputCls} placeholder="Salle, stade, parc…" />
                    </div>
                    <div>
                      <label className={labelCls}>Adresse</label>
                      <input type="text" value={form.venueAddress} onChange={(e) => handleChange('venueAddress', e.target.value)} className={inputCls} placeholder="Rue, numéro…" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className={labelCls}>Ville <span className="text-red-500">*</span></label>
                        <input type="text" value={form.venueCity} onChange={(e) => handleChange('venueCity', e.target.value)} className={inputCls} placeholder="Abidjan" />
                      </div>
                      <div>
                        <label className={labelCls}>Pays <span className="text-red-500">*</span></label>
                        <input type="text" value={form.venueCountry} onChange={(e) => handleChange('venueCountry', e.target.value)} className={inputCls} placeholder="Côte d'Ivoire" />
                      </div>
                      <div>
                        <label className={labelCls}>Code postal</label>
                        <input type="text" value={form.venuePostalCode} onChange={(e) => handleChange('venuePostalCode', e.target.value)} className={inputCls} placeholder="00000" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5">👥 Capacité totale</h2>
                <div>
                  <label className={labelCls}>Nombre de places</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className={inputCls}
                    min="1"
                    placeholder="500"
                  />
                  <p className="text-xs text-gray-400 mt-1">Capacité maximale toutes catégories confondues.</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: BILLETS ── */}
          {activeTab === 'tickets' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">🎟️ Types de billets</h2>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium text-gray-700">Gratuit</span>
                  <Toggle checked={form.isFree} onChange={() => handleChange('isFree', !form.isFree)} />
                </label>
              </div>

              {form.isFree && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
                  ✅ Événement gratuit — les prix seront mis à 0.
                </div>
              )}

              <div className="space-y-4">
                {tickets.map((ticket, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800 text-sm">🎟️ Billet {i + 1}</h3>
                      {tickets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTicket(i)}
                          className="text-red-400 hover:text-red-600 text-xs font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Nom <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => handleTicketUpdate(i, 'name', e.target.value)}
                          placeholder="Standard, VIP, Early Bird…"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={ticket.description}
                          onChange={(e) => handleTicketUpdate(i, 'description', e.target.value)}
                          placeholder="Avantages inclus…"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {!form.isFree && (
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Prix ({currencyLabel})
                          </label>
                          <input
                            type="number"
                            value={ticket.price}
                            onChange={(e) => handleTicketUpdate(i, 'price', e.target.value)}
                            min="0"
                            placeholder="0"
                            className={inputCls}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Quantité <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={ticket.quantity}
                          onChange={(e) => handleTicketUpdate(i, 'quantity', e.target.value)}
                          min="1"
                          placeholder="100"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Min/commande</label>
                        <input
                          type="number"
                          value={ticket.minPerOrder || '1'}
                          onChange={(e) => handleTicketUpdate(i, 'minPerOrder', e.target.value)}
                          min="1"
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Max/commande</label>
                        <input
                          type="number"
                          value={ticket.maxPerOrder || '10'}
                          onChange={(e) => handleTicketUpdate(i, 'maxPerOrder', e.target.value)}
                          min="1"
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Début des ventes</label>
                        <input
                          type="datetime-local"
                          value={ticket.salesStart || ''}
                          onChange={(e) => handleTicketUpdate(i, 'salesStart', e.target.value)}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Fin des ventes</label>
                        <input
                          type="datetime-local"
                          value={ticket.salesEnd || ''}
                          onChange={(e) => handle
