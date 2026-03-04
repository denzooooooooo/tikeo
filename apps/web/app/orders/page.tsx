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

const TicketSvg = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/></svg>;
const CalSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>;
const PinSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>;
const PrintSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>;
const SearchSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const CheckSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ClockSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const XSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>;
const RefundSvg = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>;
const SortSvg = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="9" x2="3" y1="18" y2="18"/></svg>;
const BagSvg = ({ size = 36 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" x2="21" y1="6" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;

interface OrderItem { id: string; ticketType?: { name: string }; quantity: number; unitPrice: number; }
interface Order {
  id: string; status: string; total: number; subtotal: number; discount?: number; createdAt: string;
  event?: { id: string; title: string; startDate?: string; venueName?: string; venueCity?: string; venueCountry?: string; coverImage?: string; slug?: string; };
  items?: OrderItem[];
}
type StatusKey = 'ALL' | 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  PAID:      { label: 'Validée',    color: 'text-green-700', bg: 'bg-green-100',  icon: <CheckSvg /> },
  CONFIRMED: { label: 'Validée',    color: 'text-green-700', bg: 'bg-green-100',  icon: <CheckSvg /> },
  PENDING:   { label: 'En attente', color: 'text-amber-700', bg: 'bg-amber-100',  icon: <ClockSvg /> },
  CANCELLED: { label: 'Annulée',    color: 'text-red-600',   bg: 'bg-red-100',    icon: <XSvg /> },
  REFUNDED:  { label: 'Remboursée', color: 'text-gray-600',  bg: 'bg-gray-100',   icon: <RefundSvg /> },
};
function getStatus(s: string) { return STATUS_CONFIG[s?.toUpperCase()] || { label: s || 'Inconnu', color: 'text-gray-600', bg: 'bg-gray-100', icon: null }; }

function formatPrice(amount: number, country?: string): string {
  if (amount === 0) return 'Gratuit';
  const c = (country || '').toLowerCase();
  if (c.includes('nigeria')) return `₦${amount.toLocaleString()}`;
  if (c.includes('ghana')) return `GH₵${amount.toLocaleString()}`;
  if (c.includes('kenya')) return `KSh ${amount.toLocaleString()}`;
  if (c.includes('france') || c.includes('belgique') || c.includes('suisse')) return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
  if (c.includes('états-unis')) return `$${amount.toLocaleString()}`;
  if (c.includes('royaume-uni')) return `£${amount.toLocaleString()}`;
  return `${amount.toLocaleString('fr-FR')} FCFA`;
}

function ReceiptModal({ order, onClose }: { order: Order; onClose: () => void }) {
  const status = getStatus(order.status);
  const eventDate = order.event?.startDate ? new Date(order.event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : null;
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 1;
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] p-6 text-white">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium opacity-80">Recu de commande</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>{status.label}</span>
          </div>
          <h2 className="text-xl font-bold">{order.event?.title || 'Commande'}</h2>
          <p className="text-white/70 text-xs mt-1">Ref: {order.id.slice(0, 20).toUpperCase()}</p>
        </div>
        <div className="p-6 space-y-1 text-sm">
          <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">Date de commande</span><span className="font-medium">{orderDate}</span></div>
          {eventDate && <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">Date evenement</span><span className="font-medium text-right max-w-[55%]">{eventDate}</span></div>}
          {order.event?.venueName && <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">Lieu</span><span className="font-medium text-right max-w-[55%]">{order.event.venueName}{order.event.venueCity ? `, ${order.event.venueCity}` : ''}</span></div>}
          {order.items && order.items.length > 0 ? order.items.map((item, i) => (
            <div key={i} className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">{item.ticketType?.name || 'Billet'} x {item.quantity}</span><span className="font-medium">{formatPrice(item.unitPrice * item.quantity, order.event?.venueCountry)}</span></div>
          )) : (
            <div className="flex justify-between py-2.5 border-b border-gray-100"><span className="text-gray-500">Billets x {totalItems}</span><span className="font-medium">{formatPrice(order.subtotal || order.total, order.event?.venueCountry)}</span></div>
          )}
          {order.discount && order.discount > 0 ? <div className="flex justify-between py-2.5 border-b border-gray-100 text-green-600"><span>Reduction</span><span>-{formatPrice(order.discount, order.event?.venueCountry)}</span></div> : null}
          <div className="flex justify-between py-3 font-bold text-base"><span>Total paye</span><span className="text-[#5B7CFF]">{formatPrice(order.total, order.event?.venueCountry)}</span></div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"><PrintSvg /> Imprimer</button>
          <button onClick={onClose} className="flex-1 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold text-sm">Fermer</button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusKey>('ALL');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('date_desc');
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setIsLoading(true); setError(null);
    try {
      const token = getAuthToken();
      if (!token) { router.push('/login'); return; }
      const res = await fetch(`${API_URL}/orders/my`, { headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 401) { router.push('/login'); return; }
      if (!res.ok) throw new Error('Impossible de charger les commandes');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : (data.orders || data.data || []));
    } catch (err: any) { setError(err.message || 'Une erreur est survenue'); }
    finally { setIsLoading(false); }
  };

  const stats = useMemo(() => {
    const confirmed = orders.filter(o => ['PAID', 'CONFIRMED'].includes(o.status?.toUpperCase()));
    return {
      confirmed: confirmed.length,
      totalSpent: confirmed.reduce((s, o) => s + (o.total || 0), 0),
      totalTickets: orders.reduce((s, o) => s + (o.items?.reduce((si, i) => si + i.quantity, 0) || 1), 0),
    };
  }, [orders]);

  const filtered = useMemo(() => {
    let list = [...orders];
    if (statusFilter !== 'ALL') list = list.filter(o => { const s = o.status?.toUpperCase(); return statusFilter === 'CONFIRMED' ? (s === 'PAID' || s === 'CONFIRMED') : s === statusFilter; });
    if (search.trim()) { const q = search.toLowerCase(); list = list.filter(o => o.event?.title?.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)); }
    list.sort((a, b) => {
      if (sort === 'date_desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sort === 'date_asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === 'amount_desc') return b.total - a.total;
      return a.total - b.total;
    });
    return list;
  }, [orders, statusFilter, search, sort]);

  const countByStatus = (key: StatusKey) => orders.filter(o => { const s = o.status?.toUpperCase(); return key === 'CONFIRMED' ? (s === 'PAID' || s === 'CONFIRMED') : s === key; }).length;

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 animate-pulse"><div className="flex gap-4"><div className="w-20 h-20 bg-gray-200 rounded-xl flex-shrink-0" /><div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-200 rounded w-1/2" /></div></div></div>)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white"><BagSvg size={24} /></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mes commandes</h1>
                <p className="text-white/75 text-sm">{orders.length} commande{orders.length !== 1 ? 's' : ''} au total</p>
              </div>
            </div>
            <Link href="/tickets" className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-semibold transition-colors"><TicketSvg /> Mes billets</Link>
          </div>
          {orders.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[{ label: 'Validees', value: String(stats.confirmed) }, { label: 'Billets achetes', value: String(stats.totalTickets) }, { label: 'Total depense', value: formatPrice(stats.totalSpent) }].map((s, i) => (
                <div key={i} className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-xl font-bold text-white">{s.value}</div>
                  <div className="text-white/70 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between"><span>{error}</span><button onClick={fetchOrders} className="text-sm underline">Reessayer</button></div>}

        {orders.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchSvg /></span>
                <input type="text" placeholder="Rechercher un evenement..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 bg-white" />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SortSvg /></span>
                <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 bg-white appearance-none cursor-pointer">
                  <option value="date_desc">Plus recent</option>
                  <option value="date_asc">Plus ancien</option>
                  <option value="amount_desc">Montant decroissant</option>
                  <option value="amount_asc">Montant croissant</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {([{ key: 'ALL' as StatusKey, label: 'Toutes' }, { key: 'CONFIRMED' as StatusKey, label: 'Validees' }, { key: 'PENDING' as StatusKey, label: 'En attente' }, { key: 'CANCELLED' as StatusKey, label: 'Annulees' }, { key: 'REFUNDED' as StatusKey, label: 'Remboursees' }]).map(f => (
                <button key={f.key} onClick={() => setStatusFilter(f.key)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === f.key ? 'bg-[#5B7CFF] text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#5B7CFF] hover:text-[#5B7CFF]'}`}>
                  {f.label}{f.key !== 'ALL' && <span className="ml-1.5 text-xs opacity-70">({countByStatus(f.key)})</span>}
                </button>
              ))}
            </div>
          </>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5 text-gray-400"><BagSvg size={36} /></div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-500 mb-6">Vous n'avez pas encore effectue d'achat.</p>
            <Link href="/events" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold">Decouvrir des evenements</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-500">Aucune commande ne correspond a votre recherche.</p>
            <button onClick={() => { setSearch(''); setStatusFilter('ALL'); }} className="mt-3 text-[#5B7CFF] text-sm underline">Reinitialiser les filtres</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(order => {
              const status = getStatus(order.status);
              const eventDate = order.event?.startDate ? new Date(order.event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
              const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
              const totalItems = order.items?.reduce((s, i) => s + i.quantity, 0) || 1;
              const ticketName = order.items?.[0]?.ticketType?.name;
              const isConfirmed = ['PAID', 'CONFIRMED'].includes(order.status?.toUpperCase());
              return (
                <article key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className="flex">
                    <div className="relative w-28 h-28 flex-shrink-0 bg-gray-100">
                      {order.event?.coverImage ? (
                        <Image src={order.event.coverImage} alt={order.event.title || ''} fill className="object-cover" sizes="112px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#5B7CFF]/20 to-[#7B61FF]/20 text-[#5B7CFF]"><TicketSvg /></div>
                      )}
                    </div>
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 truncate text-sm">{order.event?.title || 'Evenement'}</h3>
                          {ticketName && <p className="text-xs text-gray-500 mt-0.5">{ticketName} x {totalItems}</p>}
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <div className="font-bold text-[#5B7CFF]">{formatPrice(order.total, order.event?.venueCountry)}</div>
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold mt-1 ${status.bg} ${status.color}`}>{status.icon}{status.label}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                        {eventDate && <span className="flex items-center gap-1"><CalSvg /> {eventDate}</span>}
                        {order.event?.venueCity && <span className="flex items-center gap-1"><PinSvg /> {order.event.venueCity}</span>}
                        <span className="text-gray-400">Commande le {orderDate}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {isConfirmed && (
                          <Link href={`/tickets?orderId=${order.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors text-gray-700">
                            <TicketSvg /> Voir le billet
                          </Link>
                        )}
                        {order.event?.id && (
                          <Link href={`/events/${order.event.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors text-gray-700">
                            Voir l'evenement
                          </Link>
                        )}
                        <button onClick={() => setReceiptOrder(order)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 transition-colors text-gray-700">
                          <PrintSvg /> Recu
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
              <p className="text-gray-500 text-sm mb-3">Vous souhaitez acheter plus de billets ?</p>
              <Link href="/events" className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold text-sm">Decouvrir des evenements</Link>
            </div>
          </div>
        )}
      </div>

      {receiptOrder && <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />}
    </div>
  );
}
