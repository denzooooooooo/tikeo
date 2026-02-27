'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  TicketIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@tikeo/ui';
import { PromoCodeInput } from '@tikeo/ui';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  
  const [quantity, setQuantity] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [discount, setDiscount] = useState(0);

  // Mock event data - replace with API call
  const event = {
    id: eventId,
    title: 'Festival Jazz 2024',
    date: '15 Janvier 2024',
    time: '20:00',
    venue: 'Paris, France',
    coverImage: 'https://picsum.photos/seed/event/800/400',
    ticketTypes: [
      { id: '1', name: 'Standard', price: 45, description: 'Accès général' },
      { id: '2', name: 'VIP', price: 120, description: 'Accès VIP + drink' },
      { id: '3', name: 'Premium', price: 200, description: 'Tout inclus' },
    ],
  };

  const handleApplyDiscount = (discountAmount: number) => {
    setDiscount(discountAmount);
  };

  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Link */}
        <Link
          href={`/events/${eventId}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5B7CFF] mb-6"
        >
          <ArrowLeftIcon size={20} />
          Retour à l'événement
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
              <div className="flex gap-4">
                <div className="relative w-32 h-24 rounded-xl overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1">
                    <CalendarIcon size={16} />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ClockIcon size={16} />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <LocationIcon size={16} />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Selection */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Choix des billets</h2>
              <div className="space-y-3">
                {event.ticketTypes.map((ticket) => (
                  <label
                    key={ticket.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedTicket?.id === ticket.id
                        ? 'border-[#5B7CFF] bg-[#5B7CFF]/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="ticket"
                          checked={selectedTicket?.id === ticket.id}
                          onChange={() => setSelectedTicket(ticket)}
                          className="w-5 h-5 text-[#5B7CFF]"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{ticket.name}</p>
                          <p className="text-sm text-gray-600">{ticket.description}</p>
                        </div>
                      </div>
                      <p className="font-bold text-[#5B7CFF] text-lg">{ticket.price}€</p>
                    </div>
                  </label>
                ))}
              </div>

              {selectedTicket && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantité
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Promo Code */}
            <PromoCodeInput onApply={handleApplyDiscount} />
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Résumé de la commande</h3>
              
              <div className="space-y-3 pb-4 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>{selectedTicket?.name || 'Sélectionnez un billet'} x {quantity}</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Réduction ({discount}%)</span>
                    <span>-{discountAmount.toFixed(2)}€</span>
                  </div>
                )}
              </div>

              <div className="py-4 border-b border-gray-100">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)}€</span>
                </div>
              </div>

              <button
                disabled={!selectedTicket}
                className="w-full mt-6 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Procéder au paiement
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <CheckCircleIcon size={16} className="text-green-500" />
                <span>Paiement sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

