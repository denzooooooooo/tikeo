'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TicketIcon, CalendarIcon } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

interface Ticket {
  id: string;
  qrCode?: string;
  status: string;
  createdAt: string;
  order?: {
    id: string;
    event?: {
      id: string;
      title: string;
      slug: string;
      startDate: string;
      venueName: string;
      venueCity: string;
      coverImage?: string;
    };
  };
  ticketType?: {
    name: string;
    price: number;
  };
}

const STATUS_LABELS: Record<string, string> = {
  VALID: 'Valide',
  USED: 'Utilisé',
  CANCELLED: 'Annulé',
  REFUNDED: 'Remboursé',
};

const STATUS_COLORS: Record<string, string> = {
  VALID: 'bg-green-100 text-green-700',
  USED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  REFUNDED: 'bg-yellow-100 text-yellow-700',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);
    fetchTickets(token);
  }, []);

  const fetchTickets = async (token: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/tickets/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        // API returns array directly or { tickets: [...] }
        const ticketList = Array.isArray(data) ? data : (data.tickets || []);
        setTickets(ticketList);
      } else if (res.status === 401) {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const isUpcoming = (date?: string) => date ? new Date(date) > new Date() : false;

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming(t.order?.event?.startDate);
    if (filter === 'past') return !isUpcoming(t.order?.event?.startDate);
    return t.status === filter;
  });

  if (!isLoggedIn && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#5B7CFF]/10 rounded-full flex items-center justify-center">
            <TicketIcon className="text-[#5B7CFF]" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Connectez-vous pour voir vos billets</h2>
          <p className="text-gray-600 mb-6">Accédez à tous vos billets et codes QR.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">
              Se connecter
            </Link>
            <Link href="/events" className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors">
              Voir les événements
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <TicketIcon className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mes billets</h1>
              <p className="text-white/80">{tickets.length} billet{tickets.length !== 1 ? 's' : ''} au total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'upcoming', label: 'À venir' },
            { key: 'past', label: 'Passés' },
            { key: 'VALID', label: 'Valides' },
            { key: 'USED', label: 'Utilisés' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === item.key
                  ? 'bg-[#5B7CFF] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun billet</h3>
            <p className="text-gray-500 mb-6">
              {filter === 'all' ? "Vous n'avez pas encore de billets." : "Aucun billet dans cette catégorie."}
            </p>
            <Link href="/events" className="inline-block px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] transition-colors">
              Découvrir des événements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => {
              const event = ticket.order?.event;
              return (
                <div
                  key={ticket.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex">
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className="inline-block px-2 py-1 bg-[#5B7CFF]/10 text-[#5B7CFF] text-xs font-semibold rounded-full mb-2">
                            {ticket.ticketType?.name || 'Standard'}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900">
                            {event?.title || 'Événement'}
                          </h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-600'}`}>
                          {STATUS_LABELS[ticket.status] || ticket.status}
                        </span>
                      </div>
                      {event && (
                        <div className="space-y-1.5 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <CalendarIcon size={14} className="text-gray-400" />
                            <span>
                              {new Date(event.startDate).toLocaleDateString('fr-FR', {
                                weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
                                hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400">📍</span>
                            <span>{event.venueName}, {event.venueCity}</span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-3">
                        Acheté le {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    {/* Real QR Code via qrserver.com API */}
                    <div className="w-20 bg-gray-50 flex items-center justify-center border-l border-gray-100">
                      <div className="w-14 h-14 bg-white rounded-lg shadow-sm p-1 flex items-center justify-center">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=56x56&data=${encodeURIComponent(ticket.qrCode || ticket.id)}&bgcolor=ffffff&color=000000&margin=2`}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] p-6 text-white">
              <h3 className="text-xl font-bold">{selectedTicket.order?.event?.title || 'Billet'}</h3>
              <p className="text-white/80 text-sm">{selectedTicket.ticketType?.name || 'Standard'}</p>
            </div>
            <div className="p-6">
              {/* Real QR Code in modal */}
              <div className="flex justify-center mb-5">
                <div className="w-48 h-48 bg-white border-2 border-gray-200 rounded-xl p-3 flex items-center justify-center shadow-sm">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(selectedTicket.qrCode || selectedTicket.id)}&bgcolor=ffffff&color=000000&margin=4`}
                    alt="QR Code billet"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-xs text-gray-400 mb-1">Code billet</p>
                <p className="text-lg font-mono font-bold text-gray-900 tracking-wider">
                  {selectedTicket.id.slice(0, 16).toUpperCase()}
                </p>
              </div>

              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                {selectedTicket.order?.event && (
                  <>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Date</span>
                      <span className="font-medium">
                        {new Date(selectedTicket.order.event.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-50">
                      <span className="text-gray-500">Lieu</span>
                      <span className="font-medium text-right max-w-[60%]">
                        {selectedTicket.order.event.venueName}, {selectedTicket.order.event.venueCity}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-1.5 border-b border-gray-50">
                  <span className="text-gray-500">Statut</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[selectedTicket.status] || 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_LABELS[selectedTicket.status] || selectedTicket.status}
                  </span>
                </div>
                {selectedTicket.ticketType?.price !== undefined && (
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-500">Prix</span>
                    <span className="font-bold text-[#5B7CFF]">
                      {selectedTicket.ticketType.price === 0 ? 'Gratuit' : `${selectedTicket.ticketType.price}€`}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full mt-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
