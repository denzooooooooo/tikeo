'use client';




import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const TicketSvg = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>;
const CalSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const PinSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>;
const PrintSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const SearchSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const ShareSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>;
const DownloadSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const ExtSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>;
const XSvg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>;
const ClockSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;

interface Ticket {
  id: string;
  qrCode?: string;
  status: string;
  createdAt: string;
  order?: {
    id: string;
    guestEmail?: string;
    guestPhone?: string;
    billingName?: string;
    user?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    };
    event?: {
      id: string;
      title: string;
      slug?: string;
      startDate: string;
      venueName: string;
      venueCity: string;
      venueCountry?: string;
      coverImage?: string;
      ticketDesignTemplate?: string | null;
      ticketDesignBackgroundUrl?: string | null;
      ticketDesignPrimaryColor?: string | null;
      ticketDesignSecondaryColor?: string | null;
      ticketDesignTextColor?: string | null;
      ticketDesignCustomTitle?: string | null;
      ticketDesignFooterNote?: string | null;
      ticketDesignShowQr?: boolean | null;
      ticketDesignShowSeat?: boolean | null;
      ticketDesignShowTerms?: boolean | null;
    };
  };
  ticketType?: { name: string; price: number; };
}

const STATUS_LABELS: Record<string, string> = { VALID: 'Valide', USED: 'Utilise', CANCELLED: 'Annule', REFUNDED: 'Rembourse' };
const STATUS_COLORS: Record<string, string> = { VALID: 'bg-green-100 text-green-700', USED: 'bg-gray-100 text-gray-600', CANCELLED: 'bg-red-100 text-red-600', REFUNDED: 'bg-yellow-100 text-yellow-700' };

function formatPrice(amount: number, country?: string): string {
  if (amount === 0) return 'Gratuit';
  const c = (country || '').toLowerCase();
  if (c.includes('nigeria')) return `\u20a6${amount.toLocaleString()}`;
  if (c.includes('ghana')) return `GH\u20b5${amount.toLocaleString()}`;
  if (c.includes('kenya')) return `KSh ${amount.toLocaleString()}`;
  if (c.includes('france') || c.includes('belgique') || c.includes('suisse')) return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  if (c.includes('\u00e9tats-unis')) return `$${amount.toLocaleString()}`;
  if (c.includes('royaume-uni')) return `\u00a3${amount.toLocaleString()}`;
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

function getCountdown(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now();
  if (diff <= 0) return '';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `Dans ${days}j ${hours}h`;
  const mins = Math.floor((diff % 3600000) / 60000);
  return `Dans ${hours}h ${mins}min`;
}

function addToGoogleCalendar(ticket: Ticket) {
  const event = ticket.order?.event;
  if (!event) return;
  const start = new Date(event.startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = new Date(new Date(event.startDate).getTime() + 3 * 3600000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&location=${encodeURIComponent(`${event.venueName}, ${event.venueCity}`)}&details=${encodeURIComponent(`Billet Tikeo - ${ticket.ticketType?.name || 'Standard'}`)}`;
  window.open(url, '_blank');
}

function addToAppleCalendar(ticket: Ticket) {
  const event = ticket.order?.event;
  if (!event) return;
  const start = new Date(event.startDate);
  const end = new Date(start.getTime() + 3 * 3600000);
  const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${event.title}\nDTSTART:${start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nDTEND:${end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z\nLOCATION:${event.venueName}, ${event.venueCity}\nDESCRIPTION:Billet Tikeo - ${ticket.ticketType?.name || 'Standard'}\nEND:VEVENT\nEND:VCALENDAR`;
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = `${event.title}.ics`; a.click();
  URL.revokeObjectURL(url);
}

function shareTicket(ticket: Ticket) {
  const event = ticket.order?.event;
  const text = event ? `Mon billet pour ${event.title} - ${new Date(event.startDate).toLocaleDateString('fr-FR')} a ${event.venueCity}` : 'Mon billet Tikeo';
  if (navigator.share) {
    navigator.share({ title: 'Mon billet Tikeo', text, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => alert('Lien copie dans le presse-papiers'));
  }
}

// ── Ticket Detail Modal ────────────────────────────────────────────────────────
function TicketModal({ ticket, onClose }: { ticket: Ticket; onClose: () => void }) {
  const event = ticket.order?.event;
  const countdown = event?.startDate ? getCountdown(event.startDate) : '';
  const qrValue = ticket.qrCode?.trim();
  const qrUrl = qrValue
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}&bgcolor=ffffff&color=000000&margin=4`
    : null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] p-5 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"><XSvg /></button>
          <div className="pr-10">
            <span className="text-xs font-medium opacity-75 uppercase tracking-wide">{ticket.ticketType?.name || 'Standard'}</span>
            <h3 className="text-lg font-bold mt-0.5 leading-tight">{event?.title || 'Billet'}</h3>
            {countdown && (
              <div className="flex items-center gap-1.5 mt-2 bg-white/20 rounded-full px-3 py-1 w-fit">
                <ClockSvg />
                <span className="text-xs font-semibold">{countdown}</span>
              </div>
            )}
          </div>
        </div>

        {/* QR Code */}
        <div className="p-5">
          <div
            className="rounded-2xl p-4 mb-4"
            style={{
              background: `linear-gradient(135deg, ${event?.ticketDesignPrimaryColor || '#5B7CFF'} 0%, ${event?.ticketDesignSecondaryColor || '#7B61FF'} 100%)`,
              color: event?.ticketDesignTextColor || '#FFFFFF',
            }}
          >
            <p className="text-xs opacity-80 mb-1">{event?.ticketDesignTemplate || 'CLASSIC'}</p>
            <p className="font-bold text-base">{event?.ticketDesignCustomTitle || 'Billet officiel'}</p>
            <p className="text-sm opacity-90">{event?.title || 'Billet'}</p>

            {(event?.ticketDesignShowQr ?? true) && (
              <div className="flex justify-center mt-4">
                <div className="w-44 h-44 bg-white border-2 border-gray-200 rounded-xl p-2 flex items-center justify-center shadow-sm">
                  {qrUrl ? (
                    <img src={qrUrl} alt="QR Code billet" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center px-2">
                      <p className="text-[11px] text-red-500 font-medium">QR indisponible</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="text-center mb-4">
            <p className="text-xs text-gray-400 mb-1">Code billet</p>
            <p className="text-base font-mono font-bold text-gray-900 tracking-wider">{ticket.id.slice(0, 16).toUpperCase()}</p>
            <span className={`inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
              {STATUS_LABELS[ticket.status] || ticket.status}
            </span>
          </div>

          {/* Event details */}
          {event && (
            <div className="space-y-1.5 text-sm border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{new Date(event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Lieu</span>
                <span className="font-medium text-right max-w-[60%]">{event.venueName}, {event.venueCity}</span>
              </div>
              {ticket.ticketType?.price !== undefined && (
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Prix</span>
                  <span className="font-bold text-[#5B7CFF]">{formatPrice(ticket.ticketType.price, event.venueCountry)}</span>
                </div>
              )}

              <div className="pt-1.5">
                <p className="text-gray-500 text-xs mb-1">Titulaire / Acheteur</p>
                <p className="font-medium">
                  {`${ticket.order?.user?.firstName || ''} ${ticket.order?.user?.lastName || ''}`.trim() || ticket.order?.billingName || 'Non renseigné'}
                </p>
                {(ticket.order?.user?.email || ticket.order?.guestEmail) && (
                  <p className="text-xs text-gray-500 break-all">{ticket.order?.user?.email || ticket.order?.guestEmail}</p>
                )}
                {(ticket.order?.user?.phone || ticket.order?.guestPhone) && (
                  <p className="text-xs text-gray-500">{ticket.order?.user?.phone || ticket.order?.guestPhone}</p>
                )}
              </div>
            </div>
          )}

          {(event?.ticketDesignShowTerms ?? true) && (
            <p className="text-xs text-gray-500 mb-3">
              {event?.ticketDesignFooterNote || 'Merci de présenter ce billet à l’entrée.'}
            </p>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button onClick={() => window.print()} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
              <PrintSvg /> Imprimer
            </button>
            <button onClick={() => shareTicket(ticket)} className="flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-colors">
              <ShareSvg /> Partager
            </button>
          </div>
          {event && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <button onClick={() => addToGoogleCalendar(ticket)} className="flex items-center justify-center gap-1.5 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-colors">
                Google Cal
              </button>
              <button onClick={() => addToAppleCalendar(ticket)} className="flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-100 transition-colors">
                Apple Cal
              </button>
            </div>
          )}
          {event?.id && (
            <Link href={`/events/${event.id}`} className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl text-xs font-semibold">
              <ExtSvg /> Voir l&apos;evenement
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [eventFilter, setEventFilter] = useState('');
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    const token = getAuthToken();
    if (!token) { setIsLoggedIn(false); setLoading(false); return; }
    setIsLoggedIn(true);
    fetchTickets(token);
  }, []);

  const fetchTickets = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tickets/my-tickets`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setTickets(Array.isArray(data) ? data : (data.tickets || []));
      } else if (res.status === 401) { setIsLoggedIn(false); }
    } catch (err) { console.error('Error fetching tickets:', err); }
    finally { setLoading(false); }
  };

  const isUpcoming = (date?: string) => date ? new Date(date) > new Date() : false;

  // Get unique events for filter
  const events = useMemo(() => {
    const eventMap = new Map();
    tickets.forEach(t => {
      const event = t.order?.event;
      if (event?.id && event.title) {
        eventMap.set(event.id, { id: event.id, title: event.title });
      }
    });
    return Array.from(eventMap.values());
  }, [tickets]);

  const stats = useMemo(() => ({
    valid: tickets.filter(t => t.status === 'VALID').length,
    upcoming: tickets.filter(t => isUpcoming(t.order?.event?.startDate)).length,
    used: tickets.filter(t => t.status === 'USED').length,
  }), [tickets]);

  const filtered = useMemo(() => {
    let list = [...tickets];
    if (filter === 'upcoming') list = list.filter(t => isUpcoming(t.order?.event?.startDate));
    else if (filter === 'past') list = list.filter(t => !isUpcoming(t.order?.event?.startDate));
    else if (filter !== 'all') list = list.filter(t => t.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(t => t.order?.event?.title?.toLowerCase().includes(q) || t.order?.event?.venueCity?.toLowerCase().includes(q));
    }
    return list;
  }, [tickets, filter, search]);

  // Group tickets by event
  const groupedTickets = useMemo(() => {
    const groups = new Map<string, Ticket[]>();
    filtered.forEach(ticket => {
      const eventId = ticket.order?.event?.id || 'unknown';
      const eventTitle = ticket.order?.event?.title || 'Événement inconnu';
      const key = `${eventId}|||${eventTitle}`;
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(ticket);
    });
    
    let result = Array.from(groups.entries()).map(([key, tickets]) => {
      const [id, title] = key.split('|||');
      return { eventId: id, eventTitle: title, tickets };
    });
    
    // Filter by selected event
    if (eventFilter) {
      result = result.filter(g => g.eventId === eventFilter);
    }
    
    return result;
  }, [filtered, eventFilter]);

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#5B7CFF]/10 rounded-full flex items-center justify-center text-[#5B7CFF]"><TicketSvg /></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Connectez-vous pour voir vos billets</h2>
          <p className="text-gray-600 mb-6">Acces a tous vos billets et codes QR.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">Se connecter</Link>
            <Link href="/events" className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors">Voir les evenements</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white"><TicketSvg /></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mes billets</h1>
                <p className="text-white/75 text-sm">{tickets.length} billet{tickets.length !== 1 ? 's' : ''} au total</p>
              </div>
            </div>
            <Link href="/orders" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-colors">Mes commandes</Link>
          </div>
          {tickets.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[{ label: 'Valides', value: String(stats.valid) }, { label: 'A venir', value: String(stats.upcoming) }, { label: 'Utilises', value: String(stats.used) }].map((s, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
          {tickets.length > 0 && (
            <>
              {/* Search */}
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchSvg /></span>
                <input type="text" placeholder="Rechercher un evenement ou une ville..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 bg-white" />
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {/* Event filter */}
                {events.length > 0 && (
                  <select
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value)}
                    className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30"
                  >
                    <option value="">Tous les evenements</option>
                    {events.map(event => (
                      <option key={event.id} value={event.id}>{event.title}</option>
                    ))}
                  </select>
                )}
                
                {/* Status filters */}
                {[{ key: 'all', label: 'Tous' }, { key: 'upcoming', label: 'A venir' }, { key: 'past', label: 'Passes' }, { key: 'VALID', label: 'Valides' }, { key: 'USED', label: 'Utilises' }, { key: 'CANCELLED', label: 'Annules' }].map(f => (
                  <button key={f.key} onClick={() => setFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === f.key ? 'bg-[#5B7CFF] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#5B7CFF] hover:text-[#5B7CFF]'}`}>
                    {f.label}
                  </button>
                ))}
              </div>
            </>
          )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400"><TicketSvg /></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun billet</h3>
            <p className="text-gray-500 mb-6">{filter === 'all' && !search ? "Vous n'avez pas encore de billets." : "Aucun billet dans cette categorie."}</p>
            <Link href="/events" className="inline-block px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">Decouvrir des evenements</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Grouped tickets by event */}
            {groupedTickets.map((group) => {
              const event = group.tickets[0]?.order?.event;
              const isExpanded = expandedEvents.has(group.eventId);
              
              return (
                <div key={group.eventId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Event Header - Clickable to expand/collapse */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => {
                      const newExpanded = new Set(expandedEvents);
                      if (newExpanded.has(group.eventId)) {
                        newExpanded.delete(group.eventId);
                      } else {
                        newExpanded.add(group.eventId);
                      }
                      setExpandedEvents(newExpanded);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7CFF" strokeWidth="2">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{group.eventTitle}</h3>
                        <p className="text-xs text-gray-500">{group.tickets.length} billet{group.tickets.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        group.tickets.every(t => t.status === 'VALID') ? 'bg-green-100 text-green-700' :
                        group.tickets.every(t => t.status === 'USED') ? 'bg-gray-100 text-gray-600' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {group.tickets.filter(t => t.status === 'VALID').length} valide{group.tickets.filter(t => t.status === 'VALID').length !== 1 ? 's' : ''}
                      </span>
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2"
                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Tickets for this event */}
                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {group.tickets.map(ticket => {
                        const ticketEvent = ticket.order?.event;
                        const upcoming = isUpcoming(ticketEvent?.startDate);
                        const countdown = ticketEvent?.startDate ? getCountdown(ticketEvent.startDate) : '';
                        return (
                          <div key={ticket.id} className="p-4 border-b border-gray-50 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedTicket(ticket)}>
                            <div className="flex">
                              {/* Event image */}
                              <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                                {ticketEvent?.coverImage ? (
                                  <Image src={ticketEvent.coverImage} alt={ticketEvent.title || ''} fill className="object-cover" sizes="64px" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5B7CFF]/20 to-[#7B61FF]/20 text-[#5B7CFF]"><TicketSvg /></div>
                                )}
                                {upcoming && <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full animate-pulse" />}
                              </div>

                              {/* Content */}
                              <div className="flex-1 ml-3 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="min-w-0">
                                    <span className="inline-block px-2 py-0.5 bg-[#5B7CFF]/10 text-[#5B7CFF] text-xs font-semibold rounded-full mb-1">{ticket.ticketType?.name || 'Standard'}</span>
                                    <h3 className="text-sm font-bold text-gray-900 truncate">{ticketEvent?.title || 'Evenement'}</h3>
                                  </div>
                                  <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                                    {STATUS_LABELS[ticket.status] || ticket.status}
                                  </span>
                                </div>
                                {ticketEvent && (
                                  <div className="space-y-0.5 text-xs text-gray-500">
                                    <div className="flex items-center gap-1.5"><CalSvg /><span>{new Date(ticketEvent.startDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                                    <div className="flex items-center gap-1.5"><PinSvg /><span>{ticketEvent.venueName}, {ticketEvent.venueCity}</span></div>
                                  </div>
                                )}
                                {countdown && (
                                  <div className="flex items-center gap-1 mt-1 text-xs font-semibold text-green-600">
                                    <ClockSvg />{countdown}
                                  </div>
                                )}
                              </div>

                              {/* QR thumbnail */}
                              <div className="w-12 bg-gray-50 flex items-center justify-center border-l border-gray-100 flex-shrink-0 ml-2">
                                <div className="w-10 h-10 bg-white rounded-lg shadow-sm p-0.5 flex items-center justify-center">
                                  {ticket.qrCode?.trim() ? (
                                    <img
                                      src={`https://api.qrserver.com/v1/create-qr-code/?size=48x48&data=${encodeURIComponent(ticket.qrCode)}&bgcolor=ffffff&color=000000&margin=2`}
                                      alt="QR"
                                      className="w-full h-full object-contain"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <span className="text-[9px] text-red-500 font-semibold">N/A</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedTicket && <TicketModal ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />}
    </div>
  );
}
