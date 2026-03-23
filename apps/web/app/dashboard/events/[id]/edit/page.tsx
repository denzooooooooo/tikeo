'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch { return null; }
}

// ─── SVG Icons ───────────────────────────────────────────────────────────────
const ArrowLeftIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>;
const InfoIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>;
const CalendarIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const MapPinIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>;
const TicketIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5v14"/></svg>;
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/></svg>;
const SaveIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const CheckIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>;
const XIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>;
const CurrencyIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>;
const UsersIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;

// ─── Liste de pays prédéfinis ─────────────────────────────────────────────────
const COUNTRIES = [
  // Afrique de l'Ouest
  { value: "Bénin", label: "🇧🇯 Bénin" },
  { value: "Burkina Faso", label: "🇧🇫 Burkina Faso" },
  { value: "Cap-Vert", label: "🇨🇻 Cap-Vert" },
  { value: "Côte d'Ivoire", label: "🇨🇮 Côte d'Ivoire" },
  { value: "Gambie", label: "🇬🇲 Gambie" },
  { value: "Ghana", label: "🇬🇭 Ghana" },
  { value: "Guinée", label: "🇬🇳 Guinée" },
  { value: "Guinée-Bissau", label: "🇬🇼 Guinée-Bissau" },
  { value: "Liberia", label: "🇱🇷 Liberia" },
  { value: "Mali", label: "🇲🇱 Mali" },
  { value: "Mauritanie", label: "🇲🇷 Mauritanie" },
  { value: "Niger", label: "🇳🇪 Niger" },
  { value: "Nigeria", label: "🇳🇬 Nigeria" },
  { value: "Sénégal", label: "🇸🇳 Sénégal" },
  { value: "Sierra Leone", label: "🇸🇱 Sierra Leone" },
  { value: "Togo", label: "🇹🇬 Togo" },
  // Afrique Centrale
  { value: "Cameroun", label: "🇨🇲 Cameroun" },
  { value: "Congo", label: "🇨🇬 Congo" },
  { value: "RD Congo", label: "🇨🇩 RD Congo" },
  { value: "Gabon", label: "🇬🇦 Gabon" },
  { value: "Guinée équatoriale", label: "🇬🇶 Guinée équatoriale" },
  { value: "République centrafricaine", label: "🇨🇫 République centrafricaine" },
  { value: "Tchad", label: "🇹🇩 Tchad" },
  // Afrique de l'Est
  { value: "Burundi", label: "🇧🇮 Burundi" },
  { value: "Comores", label: "🇰🇲 Comores" },
  { value: "Djibouti", label: "🇩🇯 Djibouti" },
  { value: "Érythrée", label: "🇪🇷 Érythrée" },
  { value: "Éthiopie", label: "🇪🇹 Éthiopie" },
  { value: "Kenya", label: "🇰🇪 Kenya" },
  { value: "Madagascar", label: "🇲🇬 Madagascar" },
  { value: "Malawi", label: "🇲🇼 Malawi" },
  { value: "Maurice", label: "🇲🇺 Maurice" },
  { value: "Mozambique", label: "🇲🇿 Mozambique" },
  { value: "Ouganda", label: "🇺🇬 Ouganda" },
  { value: "Rwanda", label: "🇷🇼 Rwanda" },
  { value: "Seychelles", label: "🇸🇨 Seychelles" },
  { value: "Somalie", label: "🇸🇴 Somalie" },
  { value: "Soudan", label: "🇸🇩 Soudan" },
  { value: "Soudan du Sud", label: "🇸🇸 Soudan du Sud" },
  { value: "Tanzanie", label: "🇹🇿 Tanzanie" },
  { value: "Zambie", label: "🇿🇲 Zambie" },
  { value: "Zimbabwe", label: "🇿🇼 Zimbabwe" },
  // Afrique du Nord
  { value: "Algérie", label: "🇩🇿 Algérie" },
  { value: "Égypte", label: "🇪🇬 Égypte" },
  { value: "Libye", label: "🇱🇾 Libye" },
  { value: "Maroc", label: "🇲🇦 Maroc" },
  { value: "Tunisie", label: "🇹🇳 Tunisie" },
  // Afrique Australe
  { value: "Afrique du Sud", label: "🇿🇦 Afrique du Sud" },
  { value: "Angola", label: "🇦🇴 Angola" },
  { value: "Botswana", label: "🇧🇼 Botswana" },
  { value: "Eswatini", label: "🇸🇿 Eswatini" },
  { value: "Lesotho", label: "🇱🇸 Lesotho" },
  { value: "Namibie", label: "🇳🇦 Namibie" },
  // Europe
  { value: "Allemagne", label: "🇩🇪 Allemagne" },
  { value: "Belgique", label: "🇧🇪 Belgique" },
  { value: "Canada", label: "🇨🇦 Canada" },
  { value: "Espagne", label: "🇪🇸 Espagne" },
  { value: "France", label: "🇫🇷 France" },
  { value: "Italie", label: "🇮🇹 Italie" },
  { value: "Portugal", label: "🇵🇹 Portugal" },
  { value: "Royaume-Uni", label: "🇬🇧 Royaume-Uni" },
  { value: "Suisse", label: "🇨🇭 Suisse" },
  // Autres
  { value: "États-Unis", label: "🇺🇸 États-Unis" },
  { value: "Brésil", label: "🇧🇷 Brésil" },
  { value: "Chine", label: "🇨🇳 Chine" },
  { value: "Émirats arabes unis", label: "🇦🇪 Émirats arabes unis" },
  { value: "Inde", label: "🇮🇳 Inde" },
];

// ─── Category mapping (DB enum → French label) ───────────────────────────────
const CATEGORIES = [
  { value: 'MUSIC', label: 'Musique' },
  { value: 'SPORTS', label: 'Sport' },
  { value: 'ARTS', label: 'Arts & Culture' },
  { value: 'TECHNOLOGY', label: 'Technologie' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FOOD', label: 'Gastronomie' },
  { value: 'ENTERTAINMENT', label: 'Divertissement' },
  { value: 'EDUCATION', label: 'Éducation' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'CONFERENCE', label: 'Conférence' },
  { value: 'SPORTS', label: 'Sport' },
  { value: 'OTHER', label: 'Autre' },
];

// Deduplicated
const UNIQUE_CATEGORIES = CATEGORIES.filter((c, i, arr) => arr.findIndex(x => x.value === c.value) === i);

const TICKET_DESIGN_TEMPLATES = [
  { value: 'CLASSIC', label: 'Classic' },
  { value: 'NEON', label: 'Neon' },
  { value: 'GOLD', label: 'Gold' },
  { value: 'MINIMAL', label: 'Minimal' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'FESTIVE', label: 'Festive' },
  { value: 'CORPORATE', label: 'Corporate' },
];

interface TicketType {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  available: number;
  sold: number;
  maxPerOrder: number;
  salesStart?: string;
  salesEnd?: string;
}

interface TicketForm {
  id?: string; // existing ticket
  name: string;
  description: string;
  price: string;
  quantity: string;
  maxPerOrder: string;
  salesStart: string;
  salesEnd: string;
  isNew?: boolean;
  isEditing?: boolean;
}

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);
  const [coverImagePreviewError, setCoverImagePreviewError] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');


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
    currency: 'XOF',
    venuePostalCode: '',
    isOnline: false,
    streamingUrl: '',
    coverImage: '',
    capacity: '',
    visibility: 'PUBLIC',
    // Ticket design customization
    ticketDesignTemplate: 'CLASSIC',
    ticketDesignBackgroundUrl: '',
    ticketDesignPrimaryColor: '#5B7CFF',
    ticketDesignSecondaryColor: '#7B61FF',
    ticketDesignTextColor: '#111827',
    ticketDesignCustomTitle: '',
    ticketDesignFooterNote: '',
    ticketDesignShowQr: true,
    ticketDesignShowSeat: true,
    ticketDesignShowTerms: true,
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [editingTicket, setEditingTicket] = useState<TicketForm | null>(null);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState<TicketForm>({
    name: '', description: '', price: '0', quantity: '100', maxPerOrder: '10', salesStart: '', salesEnd: '',
  });

  const fetchEvent = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/events/${eventId}`, {
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error('Événement introuvable');
      const event = await res.json();

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
        currency: event.currency || 'XOF',
        venuePostalCode: event.venuePostalCode || '',
        isOnline: event.isOnline || false,
        streamingUrl: event.streamingUrl || '',
        coverImage: event.coverImage || '',
        capacity: String(event.capacity || ''),
        visibility: event.visibility || 'PUBLIC',
        ticketDesignTemplate: event.ticketDesignTemplate || 'CLASSIC',
        ticketDesignBackgroundUrl: event.ticketDesignBackgroundUrl || '',
        ticketDesignPrimaryColor: event.ticketDesignPrimaryColor || '#5B7CFF',
        ticketDesignSecondaryColor: event.ticketDesignSecondaryColor || '#7B61FF',
        ticketDesignTextColor: event.ticketDesignTextColor || '#111827',
        ticketDesignCustomTitle: event.ticketDesignCustomTitle || '',
        ticketDesignFooterNote: event.ticketDesignFooterNote || '',
        ticketDesignShowQr: event.ticketDesignShowQr ?? true,
        ticketDesignShowSeat: event.ticketDesignShowSeat ?? true,
        ticketDesignShowTerms: event.ticketDesignShowTerms ?? true,
      });

      setTicketTypes(event.ticketTypes || []);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const handleChange = (field: string, value: string | boolean) => {
    if (field === 'coverImage') setCoverImagePreviewError(false);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = async (url: string) => {
    console.log('🖼️ Image sélectionnée:', url);
    handleChange('coverImage', url);
    setUploadError('');
    setCoverImagePreviewError(false);
  };

  const uploadImage = async (file: File): Promise<string> => {
    console.log('🚀 uploadImage appelée:', file.name, file.size, file.type);
    setUploadingImage(true);
    setUploadError('');
    try {
      const token = getToken();
      console.log('🔑 Token OK:', !!token);
      if (!token) throw new Error('Non connecté');
      const formData = new FormData();
      formData.append('file', file);
      console.log('📤 Upload →', `${API_URL}/events/${eventId}/upload-cover`, file.name, file.size);
      
      const res = await fetch(`${API_URL}/events/${eventId}/upload-cover`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      const text = await res.text();
      console.log('📥 Response status:', res.status, res.statusText, 'body:', text);
      
      if (!res.ok) {
        throw new Error(`Status ${res.status}: ${text || 'Erreur upload'}`);
      }
      const data = JSON.parse(text);
      console.log('✅ Upload OK, URL:', data.url);
      return data.url;
    } catch (err: any) {
      console.error('❌ Upload ERROR:', err);
      setUploadError(err.message);
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };


  const isCoverImageUrlValid = (url: string) => {
    if (!url?.trim()) return true;
    try {
      const u = new URL(url);
      return ['http:', 'https:'].includes(u.protocol);
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    console.log('📝 PUT payload:', {
      coverImage: form.coverImage,
      eventId,
      ...form
    });

    try {
      const token = getToken();
      const payload = {
        ...form,
        capacity: form.capacity ? parseInt(form.capacity) : undefined,
        startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
        endDate: form.endDate ? new Date(form.endDate).toISOString() : undefined,
        ticketDesignBackgroundUrl: form.ticketDesignBackgroundUrl || undefined,
        ticketDesignCustomTitle: form.ticketDesignCustomTitle || undefined,
        ticketDesignFooterNote: form.ticketDesignFooterNote || undefined,
      };

      const res = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });

      const textRes = await res.text();
      console.log('📥 PUT status:', res.status, 'response:', textRes);
      
      if (!res.ok) {
        const errData = JSON.parse(textRes).catch(() => ({}));
        throw new Error(errData.message || `Erreur HTTP ${res.status}`);
      }

      const data = JSON.parse(textRes);
      console.log('✅ PUT OK');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('❌ PUT ERROR:', err);
      setError(err.message || 'Erreur inconnue');
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Ticket CRUD ─────────────────────────────────────────────────────────────

  const handleCreateTicket = async () => {
    setTicketError(null);
    if (!newTicket.name.trim()) { setTicketError('Le nom du billet est requis'); return; }
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/events/${eventId}/ticket-types`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: newTicket.name,
          description: newTicket.description || undefined,
          price: parseFloat(newTicket.price) || 0,
          quantity: parseInt(newTicket.quantity) || 0,
          maxPerOrder: parseInt(newTicket.maxPerOrder) || 10,
          salesStart: newTicket.salesStart || undefined,
          salesEnd: newTicket.salesEnd || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur création billet');
      }
      const created = await res.json();
      setTicketTypes(prev => [...prev, created]);
      setNewTicket({ name: '', description: '', price: '0', quantity: '100', maxPerOrder: '10', salesStart: '', salesEnd: '' });
      setShowNewTicketForm(false);
      setTicketSuccess('Billet créé avec succès');
      setTimeout(() => setTicketSuccess(null), 3000);
    } catch (err: any) {
      setTicketError(err.message);
    }
  };

  const handleUpdateTicket = async () => {
    if (!editingTicket?.id) return;
    setTicketError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/events/${eventId}/ticket-types/${editingTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: editingTicket.name,
          description: editingTicket.description || undefined,
          price: parseFloat(editingTicket.price) || 0,
          quantity: parseInt(editingTicket.quantity) || 0,
          maxPerOrder: parseInt(editingTicket.maxPerOrder) || 10,
          salesStart: editingTicket.salesStart || undefined,
          salesEnd: editingTicket.salesEnd || undefined,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur modification billet');
      }
      const updated = await res.json();
      setTicketTypes(prev => prev.map(t => t.id === updated.id ? updated : t));
      setEditingTicket(null);
      setTicketSuccess('Billet modifié avec succès');
      setTimeout(() => setTicketSuccess(null), 3000);
    } catch (err: any) {
      setTicketError(err.message);
    }
  };

  const handleDeleteTicket = async (ttId: string) => {
    if (!confirm('Supprimer ce type de billet ?')) return;
    setTicketError(null);
    try {
      const token = getToken();
      const res = await fetch(`${API_URL}/events/${eventId}/ticket-types/${ttId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur suppression billet');
      }
      setTicketTypes(prev => prev.filter(t => t.id !== ttId));
      setTicketSuccess('Billet supprimé');
      setTimeout(() => setTicketSuccess(null), 3000);
    } catch (err: any) {
      setTicketError(err.message);
    }
  };

  const startEditTicket = (tt: TicketType) => {
    setEditingTicket({
      id: tt.id,
      name: tt.name,
      description: tt.description || '',
      price: String(tt.price),
      quantity: String(tt.quantity),
      maxPerOrder: String(tt.maxPerOrder),
      salesStart: tt.salesStart ? new Date(tt.salesStart).toISOString().slice(0, 16) : '',
      salesEnd: tt.salesEnd ? new Date(tt.salesEnd).toISOString().slice(0, 16) : '',
    });
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white transition-all';
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500">Chargement de l&apos;événement…</p>
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
            <ArrowLeftIcon /> Mes événements
          </Link>
          <h1 className="text-3xl font-bold text-white">Modifier l&apos;événement</h1>
          <p className="text-white/80 mt-1">Mettez à jour les informations et les billets de votre événement</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 0C1200 40 960 60 720 60C480 60 240 40 0 0L0 60Z" fill="#F9FAFB" /></svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
            <XIcon />{error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-semibold flex items-center gap-2">
            <CheckIcon /> Événement mis à jour avec succès !
          </div>
        )}

        <div className="mb-6">
          <Link
            href={`/dashboard/events/${eventId}/ticket-design`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold hover:shadow-lg transition-all"
          >
            🎨 Ouvrir le studio de design billet
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#5B7CFF]/10 rounded-lg text-[#5B7CFF]"><InfoIcon /></span>
              Informations générales
            </h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Titre <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={(e) => handleChange('title', e.target.value)} className={inputCls} placeholder="Nom de votre événement" required />
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className={`${inputCls} min-h-[120px] resize-y`} placeholder="Décrivez votre événement…" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Catégorie <span className="text-red-500">*</span></label>
                  <select value={form.category} onChange={(e) => handleChange('category', e.target.value)} className={inputCls} required>
                    <option value="">Sélectionner…</option>
                    {UNIQUE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Visibilité</label>
                  <select value={form.visibility} onChange={(e) => handleChange('visibility', e.target.value)} className={inputCls}>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Privé</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelCls}>Image de couverture</label>
              <div className="space-y-3">
                  {/* Dropzone pour galerie */}
                  <DropzoneWithPreview 
                    onImageSelect={handleImageSelect}
                    currentImage={form.coverImage}
                    uploadImageFn={uploadImage}
                  />
                  {/* Fallback URL */}
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Ou URL directe (galerie)</label>
                    <input
                      type="text"
                      value={form.coverImage}
                      onChange={(e) => {
                        console.log('Input URL change:', e.target.value);
                        handleImageSelect(e.target.value);
                      }}
                      className={`${inputCls} text-xs py-2`}
                      placeholder="https://i.pinimg.com/736x/0a/97/24/0a972457c72238e3bc648841b6868e39.jpg"
                    />
                    {form.coverImage && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg border">
                        <img 
                          src={form.coverImage} 
                          alt="Preview" 
                          className="h-24 w-full object-cover rounded"
                          onError={() => console.error('Image preview erreur:', form.coverImage)}
                        />
                        <p className="text-xs text-gray-500 mt-1 truncate">{form.coverImage}</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#5B7CFF]/10 rounded-lg text-[#5B7CFF]"><CalendarIcon /></span>
              Dates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Date de début <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={form.startDate} onChange={(e) => handleChange('startDate', e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Date de fin <span className="text-red-500">*</span></label>
                <input type="datetime-local" value={form.endDate} onChange={(e) => handleChange('endDate', e.target.value)} className={inputCls} required />
              </div>
            </div>
          </div>

          {/* Lieu */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#5B7CFF]/10 rounded-lg text-[#5B7CFF]"><MapPinIcon /></span>
              Lieu
            </h2>
            <div className="mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isOnline} onChange={(e) => handleChange('isOnline', e.target.checked)} className="w-4 h-4 accent-[#5B7CFF]" />
                <span className="text-sm font-medium text-gray-700">Événement en ligne</span>
              </label>
            </div>
            {form.isOnline ? (
              <div>
                <label className={labelCls}>Lien de streaming</label>
                <input type="url" value={form.streamingUrl} onChange={(e) => handleChange('streamingUrl', e.target.value)} className={inputCls} placeholder="https://…" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Ville <span className="text-red-500">*</span></label>
                    <input type="text" value={form.venueCity} onChange={(e) => handleChange('venueCity', e.target.value)} className={inputCls} placeholder="Abidjan" required={!form.isOnline} />
                  </div>
                  <div>
                    <label className={labelCls}>Pays <span className="text-red-500">*</span></label>
                    <select value={form.venueCountry} onChange={(e) => handleChange('venueCountry', e.target.value)} className={inputCls} required={!form.isOnline}>
                      <option value="">Sélectionner un pays…</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Code postal</label>
                    <input type="text" value={form.venuePostalCode} onChange={(e) => handleChange('venuePostalCode', e.target.value)} className={inputCls} placeholder="00000" />
                  </div>
                  <div>
                    <label className={labelCls + ' flex items-center gap-1'}><CurrencyIcon /> Devise</label>
                    <select value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} className={inputCls}>
                      <option value="XOF">XOF — Franc CFA Ouest (FCFA)</option>
                      <option value="XAF">XAF — Franc CFA Central</option>
                      <option value="NGN">NGN — Naira nigérian (₦)</option>
                      <option value="GHS">GHS — Cedi ghanéen (GH₵)</option>
                      <option value="KES">KES — Shilling kényan (KSh)</option>
                      <option value="ZAR">ZAR — Rand sud-africain (R)</option>
                      <option value="MAD">MAD — Dirham marocain</option>
                      <option value="TND">TND — Dinar tunisien</option>
                      <option value="DZD">DZD — Dinar algérien</option>
                      <option value="EGP">EGP — Livre égyptienne</option>
                      <option value="EUR">EUR — Euro (€)</option>
                      <option value="CHF">CHF — Franc suisse</option>
                      <option value="GBP">GBP — Livre sterling (£)</option>
                      <option value="USD">USD — Dollar américain ($)</option>
                      <option value="CAD">CAD — Dollar canadien (CA$)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Capacité */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <span className="p-1.5 bg-[#5B7CFF]/10 rounded-lg text-[#5B7CFF]"><UsersIcon /></span>
              Capacité totale
            </h2>
            <div>
              <label className={labelCls}>Nombre de places</label>
              <input type="number" value={form.capacity} onChange={(e) => handleChange('capacity', e.target.value)} className={inputCls} min="1" placeholder="100" />
            </div>
          </div>

          {/* Ticket design */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-indigo-900 mb-2">🎨 Design du billet</h2>
            <p className="text-sm text-indigo-700">
              Le design du billet se configure uniquement dans le studio de design billet.
            </p>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between gap-4">
            <Link href="/dashboard/events" className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-gray-300 transition-colors">
              Annuler
            </Link>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50">
              {isSaving ? (
                <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Enregistrement…</>
              ) : (
                <><SaveIcon /> Enregistrer les modifications</>
              )}
            </button>
          </div>
        </form>

        {/* ─── Gestion des billets ─────────────────────────────────────────── */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="p-1.5 bg-[#5B7CFF]/10 rounded-lg text-[#5B7CFF]"><TicketIcon /></span>
              Types de billets
            </h2>
            <button
              type="button"
              onClick={() => { setShowNewTicketForm(true); setEditingTicket(null); }}
              className="flex items-center gap-2 px-4 py-2 bg-[#5B7CFF] text-white rounded-xl text-sm font-semibold hover:bg-[#4a6ae8] transition-colors"
            >
              <PlusIcon /> Ajouter un billet
            </button>
          </div>

          {ticketError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
              <XIcon />{ticketError}
            </div>
          )}
          {ticketSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
              <CheckIcon />{ticketSuccess}
            </div>
          )}

          {/* Formulaire nouveau billet */}
          {showNewTicketForm && (
            <div className="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><PlusIcon /> Nouveau type de billet</h3>
              <TicketFormFields
                ticket={newTicket}
                onChange={(field, val) => setNewTicket(prev => ({ ...prev, [field]: val }))}
                inputCls="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white transition-all"
              />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={handleCreateTicket} className="flex items-center gap-2 px-5 py-2.5 bg-[#5B7CFF] text-white rounded-xl text-sm font-semibold hover:bg-[#4a6ae8] transition-colors">
                  <CheckIcon /> Créer le billet
                </button>
                <button type="button" onClick={() => setShowNewTicketForm(false)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                  <XIcon /> Annuler
                </button>
              </div>
            </div>
          )}

          {/* Liste des billets existants */}
          {ticketTypes.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <div className="flex justify-center mb-3 opacity-40"><TicketIcon /></div>
              <p className="text-sm">Aucun type de billet. Cliquez sur "Ajouter un billet" pour commencer.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ticketTypes.map((tt) => (
                <div key={tt.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  {editingTicket?.id === tt.id ? (
                    /* Edit form */
                    <div className="p-5 bg-amber-50">
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><EditIcon /> Modifier le billet</h3>
                      <TicketFormFields
                        ticket={editingTicket}
                        onChange={(field, val) => setEditingTicket(prev => prev ? { ...prev, [field]: val } : null)}
                        inputCls="w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white transition-all"
                      />
                      <div className="flex gap-3 mt-4">
                        <button type="button" onClick={handleUpdateTicket} className="flex items-center gap-2 px-5 py-2.5 bg-[#5B7CFF] text-white rounded-xl text-sm font-semibold hover:bg-[#4a6ae8] transition-colors">
                          <SaveIcon /> Enregistrer
                        </button>
                        <button type="button" onClick={() => setEditingTicket(null)} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors">
                          <XIcon /> Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display row */
                    <div className="p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-bold text-gray-900">{tt.name}</span>
                          <span className="px-2.5 py-0.5 bg-[#5B7CFF]/10 text-[#5B7CFF] rounded-full text-xs font-semibold">
                            {tt.price === 0 ? 'Gratuit' : `${tt.price.toLocaleString()} ${form.currency}`}
                          </span>
                          <span className="text-xs text-gray-500">{tt.sold}/{tt.quantity} vendus</span>
                        </div>
                        {tt.description && <p className="text-sm text-gray-500 mt-1 truncate">{tt.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => startEditTicket(tt)}
                          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          <EditIcon /> Modifier
                        </button>
                        {tt.sold === 0 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTicket(tt.id)}
                            className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                          >
                            <TrashIcon /> Supprimer
                          </button>
                        )}
                        {tt.sold > 0 && (
                          <span className="text-xs text-gray-400 italic">{tt.sold} vente(s)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Ticket form fields component ─────────────────────────────────────────────
// ── DropzoneWithPreview Component ──
function DropzoneWithPreview({ onImageSelect, currentImage, uploadImageFn }: { onImageSelect: (url: string) => void; currentImage: string; uploadImageFn: (file: File) => Promise<string> }) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif'] },
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: async (acceptedFiles, rejectedFiles) => {
      console.log('📁 Fichiers reçus:', acceptedFiles.length);
      if (rejectedFiles.length > 0) {
        alert('Fichier rejeté: taille max 5MB ou format image seulement');
        return;
      }
      if (acceptedFiles.length === 0) return;
      setDragging(false);
      try {
        setUploading(true);
        const url = await uploadImageFn(acceptedFiles[0]);
        console.log('✅ Dropzone onImageSelect:', url);
        onImageSelect(url);
      } catch (err) {
        console.error('❌ Dropzone error:', err);
        alert('Erreur upload: ' + (err as Error).message);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all h-32 flex flex-col items-center justify-center ${
          dragging || isDragActive ? 'border-[#5B7CFF] bg-[#5B7CFF]/10 scale-[1.02]' : 
          currentImage ? 'border-transparent shadow-md bg-gradient-to-br from-gray-50 to-white' : 
          'border-gray-300 hover:border-[#5B7CFF] hover:bg-[#5B7CFF]/5'
        }`}
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
      >
<input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#5B7CFF] font-semibold">Upload en cours...</p>
          </div>
        ) : isDragActive || dragging ? (
          <p className="text-lg font-semibold text-[#5B7CFF]">📁 Déposez l&apos;image ici...</p>
        ) : currentImage ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[#5B7CFF]/20 to-[#7B61FF]/20 rounded-2xl flex items-center justify-center mb-2 mx-auto">
              <svg className="w-7 h-7 text-[#5B7CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 0 1 2.828 0L16 16m-2-2l1.586-1.586a2 2 0 0 1 2.828 0L20 14m-6-6h.01M6 20h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">Changer l&apos;image</p>
            <p className="text-xs text-gray-500">Cliquez pour remplacer</p>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-[#5B7CFF]/20 rounded-2xl flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-[#5B7CFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.5h13m-3.536-3.536L6.5 14.5l-4 4 .536.536a2.5 2.5 0 013.536 3.536l.5-.5a2.5 2.5 0 113.536 3.536l.5-.5a2.5 2.5 0 11-3.536-3.536l-.5.5a2.5 2.5 0 11-3.536 3.536z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">Cliquer ou glisser une image</p>
            <p className="text-xs text-gray-500">Jpg, Png, Webp (max 5 Mo)</p>
          </>
        )}
      </div>
      {currentImage && !uploading && (
        <div className="mt-3 p-3 bg-gray-50 rounded-xl border shadow-sm">
          <img src={currentImage} alt="Prévisualisation" className="h-24 w-full object-cover rounded-lg" />
          <p className="text-xs text-gray-500 mt-1 truncate font-mono">{currentImage}</p>
        </div>
      )}
    </div>
  );
}

function TicketFormFields({
  ticket,
  onChange,
  inputCls,
}: {
  ticket: { name: string; description: string; price: string; quantity: string; maxPerOrder: string; salesStart: string; salesEnd: string };
  onChange: (field: string, value: string) => void;
  inputCls: string;
}) {
  const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Nom du billet <span className="text-red-500">*</span></label>
          <input type="text" value={ticket.name} onChange={e => onChange('name', e.target.value)} className={inputCls} placeholder="VIP, Standard, Gratuit…" />
        </div>
        <div>
          <label className={labelCls}>Prix (0 = Gratuit)</label>
          <input type="number" value={ticket.price} onChange={e => onChange('price', e.target.value)} className={inputCls} min="0" step="0.01" placeholder="0" />
        </div>
        <div>
          <label className={labelCls}>Quantité disponible</label>
          <input type="number" value={ticket.quantity} onChange={e => onChange('quantity', e.target.value)} className={inputCls} min="1" placeholder="100" />
        </div>
        <div>
          <label className={labelCls}>Max par commande</label>
          <input type="number" value={ticket.maxPerOrder} onChange={e => onChange('maxPerOrder', e.target.value)} className={inputCls} min="1" placeholder="10" />
        </div>
        <div>
          <label className={labelCls}>Début des ventes</label>
          <input type="datetime-local" value={ticket.salesStart} onChange={e => onChange('salesStart', e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Fin des ventes</label>
          <input type="datetime-local" value={ticket.salesEnd} onChange={e => onChange('salesEnd', e.target.value)} className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Description (optionnel)</label>
        <textarea value={ticket.description} onChange={e => onChange('description', e.target.value)} className={`${inputCls} min-h-[60px] resize-none`} placeholder="Avantages inclus, accès VIP…" />
      </div>
    </div>
  );
}
