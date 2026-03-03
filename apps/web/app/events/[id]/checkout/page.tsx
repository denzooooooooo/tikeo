'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CalendarIcon,
  ClockIcon,
  LocationIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
} from '@tikeo/ui';
import { PromoCodeInput } from '@tikeo/ui';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  try {
    const storedTokens = localStorage.getItem('auth_tokens');
    if (storedTokens) {
      const parsed = JSON.parse(storedTokens);
      return parsed.accessToken || null;
    }
  } catch {
    // ignore
  }
  return null;
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  available?: number;
}

interface EventData {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  location?: string;
  coverImage?: string;
  ticketTypes: TicketType[];
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent({
          id: data.id,
          title: data.title,
          date: data.startDate
            ? new Date(data.startDate).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            : data.date || '',
          time: data.startDate
            ? new Date(data.startDate).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })
            : data.time || '',
          venue: data.venueName || data.venue || data.location || data.address || '',
          coverImage:
            data.coverImage || data.image || 'https://picsum.photos/seed/event/800/400',
          ticketTypes: (data.ticketTypes || data.tickets || []).map((t: any) => ({
            id: t.id,
            name: t.name || t.type,
            price: t.price,
            description: t.description || '',
            available: t.available ?? t.quantity,
          })),
        });
      }
    } catch (err) {
      console.error('Error fetching event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDiscount = (discountAmount: number, code?: string) => {
    setDiscount(discountAmount);
    if (code) setPromoCode(code);
  };

  const handlePayment = async () => {
    if (!selectedTicket || !eventId) return;

    setIsProcessing(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setError('Vous devez être connecté pour effectuer un paiement');
        setIsProcessing(false);
        return;
      }

      // Step 1: Create order
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId,
          ticketTypeId: selectedTicket.id,
          quantity,
          promoCode: promoCode || undefined,
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Impossible de créer la commande');
      }

      const order = await orderRes.json();

      // Step 2: Create payment intent (requires Stripe configured on backend)
      const paymentRes = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: order.total,
        }),
      });

      if (paymentRes.ok) {
        const paymentData = await paymentRes.json();
        // If Stripe is configured, redirect to Stripe checkout or use Stripe Elements
        // For now, show success and redirect to orders page
        if (paymentData.clientSecret) {
          // TODO: Integrate Stripe Elements here
          alert(`Commande créée! Référence: ${order.id}\nMontant: ${order.total.toFixed(2)}€\n\nIntégration Stripe en cours...`);
          router.push('/orders');
        } else {
          alert(`Commande créée avec succès! Référence: ${order.id}`);
          router.push('/orders');
        }
      } else {
        // Payment service not configured (no Stripe key) - order created but payment pending
        const errData = await paymentRes.json().catch(() => ({}));
        if (errData.message?.includes('Stripe is not configured')) {
          // Demo mode - order created successfully
          alert(`✅ Commande créée avec succès!\n\nRéférence: ${order.id}\nMontant: ${order.total.toFixed(2)}€\n\n(Mode démo - paiement Stripe non configuré)`);
          router.push('/orders');
        } else {
          throw new Error(errData.message || 'Erreur lors du paiement');
        }
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Une erreur est survenue lors du paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Événement introuvable</p>
            <Link href="/events" className="text-[#5B7CFF] hover:underline">
              Retour aux événements
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

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

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
                <div className="flex gap-4">
                  <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={event.coverImage || 'https://picsum.photos/seed/event/800/400'}
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
                    {event.time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon size={16} />
                        <span>{event.time}</span>
                      </div>
                    )}
                    {event.venue && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <LocationIcon size={16} />
                        <span>{event.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Choix des billets</h2>
                {event.ticketTypes.length === 0 ? (
                  <p className="text-gray-500">Aucun billet disponible pour cet événement.</p>
                ) : (
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
                              {ticket.description && (
                                <p className="text-sm text-gray-600">{ticket.description}</p>
                              )}
                              {ticket.available !== undefined && (
                                <p className="text-xs text-gray-400">{ticket.available} disponibles</p>
                              )}
                            </div>
                          </div>
                          <p className="font-bold text-[#5B7CFF] text-lg">
                            {ticket.price === 0 ? 'Gratuit' : `${ticket.price.toFixed(2)}€`}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {selectedTicket && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantité
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-xl font-bold"
                      >
                        -
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                      <button
                        onClick={() =>
                          setQuantity(
                            Math.min(
                              quantity + 1,
                              selectedTicket.available ?? 10
                            )
                          )
                        }
                        className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-xl font-bold"
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
                    <span>
                      {selectedTicket?.name || 'Sélectionnez un billet'} x {quantity}
                    </span>
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
                  disabled={!selectedTicket || isProcessing}
                  onClick={handlePayment}
                  className="w-full mt-6 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Traitement...
                    </span>
                  ) : (
                    'Procéder au paiement'
                  )}
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
