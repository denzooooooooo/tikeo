'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  CalendarIcon,
  LocationIcon,
  TicketIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  LockIcon,
} from '@tikeo/ui';
import { PromoCodeInput } from '@tikeo/ui';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

// ─── Stripe init ────────────────────────────────────────────────────────────
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

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

// ─── Types ───────────────────────────────────────────────────────────────────
interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity?: number;
}

interface EventData {
  id: string;
  title: string;
  startDate: string;
  venueName?: string;
  venueCity?: string;
  venueCountry?: string;
  coverImage?: string;
  currency?: string;
  ticketTypes: TicketType[];
}

// ─── Card element styles ─────────────────────────────────────────────────────
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

// ─── Payment form (inner — needs Stripe context) ─────────────────────────────
function PaymentForm({
  event,
  selectedTicket,
  quantity,
  discount,
  promoCode,
  onSuccess,
}: {
  event: EventData;
  selectedTicket: TicketType;
  quantity: number;
  discount: number;
  promoCode: string;
  onSuccess: (orderId: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = selectedTicket.price * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;
  const isFree = total === 0;

  const handlePay = async () => {
    setError(null);
    setIsPaying(true);

    const token = getToken();
    if (!token) {
      setError('Vous devez être connecté pour payer.');
      setIsPaying(false);
      return;
    }

    try {
      // 1. Create order
      const orderRes = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event.id,
          ticketTypeId: selectedTicket.id,
          quantity,
          promoCode: promoCode || undefined,
        }),
      });

      if (!orderRes.ok) {
        const err = await orderRes.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur lors de la création de la commande');
      }

      const order = await orderRes.json();

      // 2. Free ticket — confirm directly
      if (isFree) {
        onSuccess(order.id);
        return;
      }

      // 3. Create payment intent
      const piRes = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order.id, amount: total }),
      });

      if (!piRes.ok) {
        const err = await piRes.json().catch(() => ({}));
        throw new Error(err.message || 'Erreur lors de la création du paiement');
      }

      const { clientSecret } = await piRes.json();

      // 4. Confirm card payment with Stripe.js
      if (!stripe || !elements) {
        throw new Error('Stripe non initialisé');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Formulaire de carte introuvable');

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError) {
        throw new Error(stripeError.message || 'Paiement refusé');
      }

      if (paymentIntent?.status === 'succeeded') {
        // 5. Confirm on backend
        await fetch(`${API_URL}/payments/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        onSuccess(order.id);
      } else {
        throw new Error('Le paiement n\'a pas abouti');
      }
    } catch (err) {
      setError((err as Error).message || 'Une erreur est survenue');
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Order summary */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>{selectedTicket.name} × {quantity}</span>
          <span>{subtotal.toFixed(2)} {event.currency || 'EUR'}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Réduction ({discount}%)</span>
            <span>−{discountAmount.toFixed(2)} {event.currency || 'EUR'}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>{total.toFixed(2)} {event.currency || 'EUR'}</span>
        </div>
      </div>

      {/* Card element (only for paid tickets) */}
      {!isFree && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Informations de carte bancaire
          </label>
          <div className="border border-gray-300 rounded-xl p-4 bg-white focus-within:ring-2 focus-within:ring-[#5B7CFF] focus-within:border-transparent transition-all">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
          <p className="mt-2 text-xs text-gray-500 flex items-center gap-1">
            <LockIcon size={12} />
            Paiement sécurisé par Stripe — vos données ne sont jamais stockées
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Pay button */}
      <button
        onClick={handlePay}
        disabled={isPaying || (!isFree && !stripe)}
        className="w-full bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-4 rounded-xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isPaying ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Traitement en cours…
          </>
        ) : isFree ? (
          'Confirmer la réservation gratuite'
        ) : (
          <>
            <LockIcon size={16} />
            Payer {total.toFixed(2)} {event.currency || 'EUR'}
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
        <span>🔒 SSL</span>
        <span>💳 Visa / Mastercard / Amex</span>
        <span>🛡️ 3D Secure</span>
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────
function SuccessScreen({ orderId, eventTitle }: { orderId: string; eventTitle: string }) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/tickets'), 5000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="text-center py-16 px-4">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon size={56} className="text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">Paiement réussi !</h2>
      <p className="text-gray-600 mb-2">
        Votre billet pour <strong>{eventTitle}</strong> a été confirmé.
      </p>
      <p className="text-sm text-gray-500 mb-8">
        Commande <span className="font-mono font-semibold">#{orderId.slice(-8).toUpperCase()}</span>
        {' '}— Un email de confirmation vous a été envoyé.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/tickets"
          className="px-8 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          Voir mes billets
        </Link>
        <Link
          href="/events"
          className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          Découvrir d'autres événements
        </Link>
      </div>
      <p className="text-xs text-gray-400 mt-6">Redirection automatique vers vos billets dans 5 secondes…</p>
    </div>
  );
}

// ─── Main checkout page ───────────────────────────────────────────────────────
export default function CheckoutPage() {
  const params = useParams();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [step, setStep] = useState<'select' | 'pay' | 'success'>('select');
  const [successOrderId, setSuccessOrderId] = useState('');

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/events/${eventId}`);
      if (!res.ok) return;
      const data = await res.json();
      const ev: EventData = {
        id: data.id,
        title: data.title,
        startDate: data.startDate,
        venueName: data.venueName || data.venue,
        venueCity: data.venueCity,
        venueCountry: data.venueCountry,
        coverImage: data.coverImage,
        currency: data.currency || 'EUR',
        ticketTypes: (data.ticketTypes || []).map((t: any) => ({
          id: t.id,
          name: t.name,
          price: Number(t.price),
          description: t.description || '',
          quantity: t.quantity,
        })),
      };
      setEvent(ev);
      if (ev.ticketTypes.length > 0) setSelectedTicket(ev.ticketTypes[0]);
    } catch (err) {
      console.error('Error fetching event:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId, fetchEvent]);

  const handleApplyDiscount = (pct: number, code: string) => {
    setDiscount(pct);
    setPromoCode(code);
  };

  const handleSuccess = (orderId: string) => {
    setSuccessOrderId(orderId);
    setStep('success');
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
        </div>
      </ProtectedRoute>
    );
  }

  if (!event) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Événement introuvable.</p>
            <Link href="/events" className="text-[#5B7CFF] font-semibold hover:underline">
              Retour aux événements
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const subtotal = (selectedTicket?.price || 0) * quantity;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link
              href={`/events/${event.id}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">{event.title}</h1>
              <p className="text-sm text-gray-500">Commande sécurisée</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {step === 'success' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <SuccessScreen orderId={successOrderId} eventTitle={event.title} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left — ticket selection */}
              <div className="lg:col-span-3 space-y-6">
                {/* Event info */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">Détails de l'événement</h2>
                  <div className="space-y-2 text-sm text-gray-600">
                    {event.startDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon size={16} className="text-[#5B7CFF]" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString('fr-FR', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          })}
                          {' à '}
                          {new Date(event.startDate).toLocaleTimeString('fr-FR', {
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </div>
                    )}
                    {(event.venueName || event.venueCity) && (
                      <div className="flex items-center gap-2">
                        <LocationIcon size={16} className="text-[#5B7CFF]" />
                        <span>
                          {[event.venueName, event.venueCity, event.venueCountry]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ticket selection */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TicketIcon size={20} className="text-[#5B7CFF]" />
                    Choisir un billet
                  </h2>

                  {event.ticketTypes.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aucun billet disponible pour cet événement.</p>
                  ) : (
                    <div className="space-y-3">
                      {event.ticketTypes.map((ticket) => (
                        <label
                          key={ticket.id}
                          className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedTicket?.id === ticket.id
                              ? 'border-[#5B7CFF] bg-[#5B7CFF]/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="ticket"
                              value={ticket.id}
                              checked={selectedTicket?.id === ticket.id}
                              onChange={() => setSelectedTicket(ticket)}
                              className="accent-[#5B7CFF]"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{ticket.name}</p>
                              {ticket.description && (
                                <p className="text-xs text-gray-500">{ticket.description}</p>
                              )}
                              {ticket.quantity !== undefined && (
                                <p className="text-xs text-gray-400">{ticket.quantity} places restantes</p>
                              )}
                            </div>
                          </div>
                          <span className="font-bold text-[#5B7CFF] text-lg">
                            {ticket.price === 0 ? 'Gratuit' : `${ticket.price.toFixed(2)} ${event.currency || 'EUR'}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Quantity */}
                  {selectedTicket && (
                    <div className="mt-4 flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-700">Quantité :</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold text-gray-900">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(10, quantity + 1))}
                          className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Promo code */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <PromoCodeInput
                    onApply={(pct: number) => handleApplyDiscount(pct, '')}
                  />
                </div>
              </div>

              {/* Right — payment */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                  <h2 className="text-lg font-bold text-gray-900 mb-6">Paiement</h2>

                  {selectedTicket ? (
                    <Elements stripe={stripePromise}>
                      <PaymentForm
                        event={event}
                        selectedTicket={selectedTicket}
                        quantity={quantity}
                        discount={discount}
                        promoCode={promoCode}
                        onSuccess={handleSuccess}
                      />
                    </Elements>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-8">
                      Sélectionnez un type de billet pour continuer.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
