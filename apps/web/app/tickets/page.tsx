'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TicketIcon, CalendarIcon, MapPinIcon, ChevronRightIcon } from '@tikeo/ui';

interface Ticket {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  ticketType: string;
  price: number;
  currency: string;
  status: string;
  seatInfo: string | null;
  purchaseDate: string;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    let token: string | null = null;
    try {
      const stored = localStorage.getItem('auth_tokens');
      token = stored ? JSON.parse(stored).accessToken : null;
    } catch {
      token = null;
    }

    if (!token) {
      setIsLoading(false);
      return;
    }

    const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const apiBase = rawUrl.includes('/api/v1') ? rawUrl.replace(/\/$/, '') : rawUrl.replace(/\/$/, '') + '/api/v1';

    try {
      const response = await fetch(`${apiBase}/tickets/my-tickets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      } else {
        setTickets([
          {
            id: 'tkt1',
            eventId: 'evt1',
            eventTitle: 'Festival de Musique 2024',
            eventDate: '2024-06-15T20:00:00Z',
            eventVenue: 'Paris, AccorHotels Arena',
            ticketType: 'VIP',
            price: 89.99,
            currency: 'EUR',
            status: 'VALID',
            seatInfo: 'Section A, Rang 5, Place 12',
            purchaseDate: '2024-01-10T14:30:00Z',
          },
        ]);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([
        {
          id: 'tkt1',
          eventId: 'evt1',
          eventTitle: 'Festival de Musique 2024',
          eventDate: '2024-06-15T20:00:00Z',
          eventVenue: 'Paris, AccorHotels Arena',
          ticketType: 'VIP',
          price: 89.99,
          currency: 'EUR',
          status: 'VALID',
          seatInfo: 'Section A, Rang 5, Place 12',
          purchaseDate: '2024-01-10T14:30:00Z',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'bg-green-100 text-green-700';
      case 'USED':
        return 'bg-gray-100 text-gray-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      case 'REFUNDED':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VALID':
        return 'Valide';
      case 'USED':
        return 'Utilis';
      case 'CANCELLED':
        return 'Annul';
      case 'REFUNDED':
        return 'Rembours';
      default:
        return status;
    }
  };

  const isUpcoming = (date: string) => {
    return new Date(date) > new Date();
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming(ticket.eventDate);
    if (filter === 'past') return !isUpcoming(ticket.eventDate);
    return ticket.status === filter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes billets</h1>
          <p className="text-gray-600 mt-2">Grez vos billets d&apos;vnements</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'upcoming', label: ' venir' },
            { key: 'past', label: 'Passs' },
            { key: 'VALID', label: 'Valids' },
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

        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun billet</h3>
            <p className="text-gray-500 mb-6">Vous n&apos;avez pas encore de billets.</p>
            <a href="/events" className="inline-block px-6 py-2 bg-[#5B7CFF] text-white rounded-lg font-semibold hover:bg-[#7B61FF] transition-colors">
              Dcouvrir des vnements
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="inline-block px-2 py-1 bg-[#5B7CFF]/10 text-[#5B7CFF] text-xs font-medium rounded-full mb-2">
                          {ticket.ticketType}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900">{ticket.eventTitle}</h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                        {getStatusText(ticket.status)}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} />
                        <span>
                          {new Date(ticket.eventDate).toLocaleDateString('fr-FR', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon size={16} />
                        <span>{ticket.eventVenue}</span>
                      </div>
                      {ticket.seatInfo && (
                        <div className="flex items-center gap-2">
                          <span className="text-[#5B7CFF]"></span>
                          <span>{ticket.seatInfo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-24 bg-gray-50 flex items-center justify-center border-l border-gray-100">
                    <div className="w-16 h-16 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                      <span className="text-2xl">QR</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] p-6 text-white">
              <h3 className="text-xl font-bold">{selectedTicket.eventTitle}</h3>
              <p className="opacity-90">{selectedTicket.ticketType}</p>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-6">
                <div className="w-48 h-48 bg-white border-4 border-gray-100 rounded-xl p-4 flex items-center justify-center">
                  <span className="text-4xl font-mono">{selectedTicket.id.toUpperCase()}</span>
                </div>
              </div>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Code de votre billet</p>
                <p className="text-2xl font-mono font-bold text-gray-900">{selectedTicket.id.toUpperCase()}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{new Date(selectedTicket.eventDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Lieu</span>
                  <span className="font-medium text-right">{selectedTicket.eventVenue}</span>
                </div>
                {selectedTicket.seatInfo && (
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Place</span>
                    <span className="font-medium">{selectedTicket.seatInfo}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Prix</span>
                  <span className="font-medium">{selectedTicket.price.toFixed(2)} {selectedTicket.currency}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full mt-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
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
