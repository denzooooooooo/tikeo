'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const API_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  return raw.includes('/api/v1')
    ? raw.replace(/\/$/, '')
    : raw.replace(/\/$/, '') + '/api/v1';
})();

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch {
    return null;
  }
}

interface Ticket {
  id: string;
  qrCode: string;
  status: string;
  price: number;
  purchaseDate: string;
  event: {
    id: string;
    title: string;
    coverImage?: string;
    startDate: string;
    venueName?: string;
    venueCity?: string;
  };
  ticketType?: {
    name: string;
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  VALID: { label: 'Valide', color: 'bg-green-100 text-green-700' },
  USED: { label: 'Utilisé', color: 'bg-gray-100 text-gray-600' },
  CANCELLED: { label: 'Annulé', color: 'bg-red-100 text-red-700' },
  EXPIRED: { label: 'Expiré', color: 'bg-orange-100 text-orange-700' },
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [filter, setFilter] = useState<'all' | 'VALID' | 'USED' | 'CANCELLED'>('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }

    setIsLoggedIn(true);

    try {
      const response = await fetch(`${API_URL}/tickets/my-tickets`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(Array.isArray(data) ? data : []);
      } else {
        setTickets([]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = filter === 'all' ? tickets : tickets.filter((t) => t.status === filter);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-1">Mes billets</h1>
          <p className="text-white/80">Retrouvez tous vos billets d'événements</p>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        {!isLoggedIn ? (
          /* Not logged in */
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🎟️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Connectez-vous pour voir vos billets
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Créez un compte ou connectez-vous pour accéder à vos billets.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/login"
                className="px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Me connecter
              </Link>
              <Link
                href="/register"
                className="px-8 py-3 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {(['all', 'VALID', 'USED', 'CANCELLED'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    filter === f
                      ? 'bg-[#5B7CFF] text-white shadow-md'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#5B7CFF]'
                  }`}
                >
                  {f === 'all' ? `Tous (${tickets.length})` : STATUS_LABELS[f]?.label || f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🎟️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun billet trouvé</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'all'
                    ? "Vous n'avez pas encore acheté de billets."
                    : `Aucun billet avec le statut "${STATUS_LABELS[filter]?.label}".`}
                </p>
                <Link
                  href="/events"
                  className="px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Découvrir des événements
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((ticket) => {
                  const statusInfo = STATUS_LABELS[ticket.status] || { label: ticket.status, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                    >
                      {/* Event cover */}
                      {ticket.event.coverImage && (
                        <div className="h-32 bg-gray-200 overflow-hidden">
                          <img
                            src={ticket.event.coverImage}
                            alt={ticket.event.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900 text-base leading-tight flex-1 mr-2">
                            {ticket.event.title}
                          </h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-1">
                          🎟️ {ticket.ticketType?.name || 'Billet standard'}
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          📅 {formatDate(ticket.event.startDate)}
                        </p>
                        {(ticket.event.venueName || ticket.event.venueCity) && (
                          <p className="text-sm text-gray-500">
                            📍 {[ticket.event.venueName, ticket.event.venueCity].filter(Boolean).join(', ')}
                          </p>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-xs text-gray-400 font-mono">
                            #{ticket.id.slice(-8).toUpperCase()}
                          </span>
                          <span className="text-sm font-bold text-[#5B7CFF]">
                            {ticket.price === 0 ? 'Gratuit' : `${Number(ticket.price).toFixed(2)} €`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* QR Code modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] p-5 text-white">
              <h3 className="text-lg font-bold">{selectedTicket.event.title}</h3>
              <p className="text-white/80 text-sm">{selectedTicket.ticketType?.name || 'Billet standard'}</p>
            </div>

            <div className="p-6">
              {/* QR Code display */}
              <div className="flex justify-center mb-5">
                <div className="w-48 h-48 bg-gray-50 border-2 border-gray-200 rounded-xl flex flex-col items-center justify-center p-3">
                  {/* Simple QR code visual representation */}
                  <div className="text-4xl mb-2">📱</div>
                  <p className="text-xs text-gray-500 text-center font-mono break-all">
                    {selectedTicket.qrCode}
                  </p>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 mb-1">Code de votre billet</p>
                <p className="text-xl font-mono font-bold text-gray-900">
                  #{selectedTicket.id.slice(-8).toUpperCase()}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{formatDate(selectedTicket.event.startDate)}</span>
                </div>
                {(selectedTicket.event.venueName || selectedTicket.event.venueCity) && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Lieu</span>
                    <span className="font-medium text-right">
                      {[selectedTicket.event.venueName, selectedTicket.event.venueCity].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Statut</span>
                  <span className={`font-semibold text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[selectedTicket.status]?.color}`}>
                    {STATUS_LABELS[selectedTicket.status]?.label || selectedTicket.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Prix</span>
                  <span className="font-medium">
                    {selectedTicket.price === 0 ? 'Gratuit' : `${Number(selectedTicket.price).toFixed(2)} €`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Acheté le</span>
                  <span className="font-medium">
                    {new Date(selectedTicket.purchaseDate).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full mt-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
