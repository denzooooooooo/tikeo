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
  TicketIcon,
} from '@tikeo/ui';
import { PromoCodeInput } from '@tikeo/ui';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getApiBase(url: string) {
  return url.includes('/api/v1') ? url.replace(/\/$/, '') : url.replace(/\/$/, '') + '/api/v1';
}

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth_tokens');
    if (!stored) return null;
    return JSON.parse(stored).accessToken ?? null;
  } catch {
    return null;
  }
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
  venueCity?: string;
  coverImage?: string;
  currency?: string;
  ticketTypes: TicketType[];
}

type CheckoutStep = 'selection' | 'processing' | 'success' | 'error';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const [step, setStep] = useState<CheckoutStep>('selection');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBase(API_URL)}/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setEvent({
          id: data.id,
          title: data.title,
          date: data.startDate
            ? new Date(data.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
            : '',
          time: data.startDate
            ? new Date(data.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            : '',
          venue: data.venueName || data.venueAddress || '',
          venueCity: data.venueCity || '',
          coverImage: data.coverImage || 'https://picsum.photos/seed/event/800/400',
          currency: data.currency || 'XOF',
          ticketTypes: (data.ticketTypes || []).map((t: any) => ({
            id: t.id,
            name: t.name,
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

  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  const currencyLabel = event?.currency || 'XOF';

  const handlePayment = async () => {
    if (!selectedTicket || !event) return;

    const token = getToken();
    if (!token) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    setStep('processing');
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const apiBase = getApiBase(API_URL);

      // Step 1: Create order
      const orderRes = await fetch(`${apiBase}/orders`, {
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
        const errData = await orderRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Erreur lors de la création de la commande');
      }

      const order = await orderRes.json();
      const createdOrderId = order.id || order.orderId;
      setOrderId(createdOrderId);

      // Step 2: If free ticket, confirm directly
      if (total === 0) {
        setStep('success');
        return;
      }

      // Step 3: Create payment intent
      const paymentRes = await fetch(`${apiBase}/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderId: createdOrderId,
          amount: Math.round(total * 100), // in cents
          currency: currencyLabel.toLowerCase() === 'eur' ? 'eur' : 'xof',
          eventId: event.id,
          ticketTypeId: selectedTicket.id,
          quantity,
        }),
      });

      if (!paymentRes.ok) {
        const errData = await paymentRes.json().catch(() => ({}));
        throw new Error(errData.message || 'Erreur lors de la création du paiement');
      }

      // Payment intent created — for now mark as success
      // In production, you'd integrate Stripe.js here to confirm the payment
      setStep('success');
    } catch (err: any) {
      console.error('Payment error:', err);
      setErrorMsg(err.message || 'Une erreur est survenue lors du paiement');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
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
            <Link href="/events" className="text-[#5B7CFF] hover:underline">Retour aux événements</Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // ── SUCCESS STATE ──
  if (step === 'success') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée ! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Votre commande a été enregistrée avec succès. Vos billets vous seront envoyés par email.
            </p>
            {orderId && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs text-gray-500 mb-1">Numéro de commande</p>
                <p className="font-mono font-bold text-gray-900 text-sm">{orderId}</p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-700">
                📧 Un email de confirmation avec vos billets vous a été envoyé.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link
                href="/tickets"
                className="w-full py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <TicketIcon size={20} />
                Voir mes billets
              </Link>
              <Link
                href="/events"
                className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Découvrir d&apos;autres événements
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // ── ERROR STATE ──
  if (step === 'error') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Paiement échoué</h2>
            <p className="text-gray-600 mb-6">{errorMsg || 'Une erreur est survenue lors du paiement.'}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep('selection')}
                className="w-full py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Réessayer
              </button>
              <Link
                href={`/events/${eventId}`}
                className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Retour à l&apos;événement
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // ── PROCESSING STATE ──
  if (step === 'processing') {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-8 text-center">
            <div className="w-20 h-20 bg-[#5B7CFF]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Traitement en cours…</h2>
            <p className="text-gray-600">Veuillez patienter pendant que nous traitons votre commande.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // ── SELECTION STATE ──
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Back Link */}
          <Link
            href={`/events/${eventId}`}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5B7CFF] mb-6 transition-colors"
          >
            <ArrowLeftIcon size={20} />
            Retour à l&apos;événement
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Summary */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📋 Récapitulatif</h2>
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
                      <span className="text-sm">{event.date}</span>
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <ClockIcon size={16} />
                        <span className="text-sm">{event.time}</span>
                      </div>
                    )}
                    {(event.venue || event.venueCity) && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <LocationIcon size={16} />
                        <span className="text-sm">{[event.venue, event.venueCity].filter(Boolean).join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Ticket Selection */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🎟️ Choix des billets</h2>

                {event.ticketTypes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <TicketIcon size={40} className="mx-auto mb-3 text-gray-300" />
                    <p>Aucun billet disponible pour cet événement.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {event.ticketTypes.map((ticket) => (
                      <label
                        key={ticket.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedTicket?.id === ticket.id
                            ? 'border-[#5B7CFF] bg-[#5B7CFF]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${(ticket.available ?? 1) <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="ticket"
                              checked={selectedTicket?.id === ticket.id}
                              onChange={() => (ticket.available ?? 1) > 0 && setSelectedTicket(ticket)}
                              disabled={(ticket.available ?? 1) <= 0}
                              className="w-5 h-5 text-[#5B7CFF]"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{ticket.name}</p>
                              {ticket.description && (
                                <p className="text-sm text-gray-500">{ticket.description}</p>
                              )}
                              {(ticket.available ?? 1) <= 0 && (
                                <p className="text-xs text-red-500 font-medium">Épuisé</p>
                              )}
                              {(ticket.available ?? 999) > 0 && (ticket.available ?? 999) <= 10 && (
                                <p className="text-xs text-orange-500 font-medium">
                                  Plus que {ticket.available} place{(ticket.available ?? 0) > 1 ? 's' : ''} !
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="font-bold text-[#5B7CFF] text-lg whitespace-nowrap">
                            {ticket.price === 0 ? 'Gratuit' : `${ticket.price.toLocaleString()} ${currencyLabel}`}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {selectedTicket && (
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quantité</label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg transition-colors"
                      >
                        −
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(selectedTicket.available ?? 10, quantity + 1))}
                        className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 font-bold text-lg transition-colors"
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
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                <h3 className="text-xl font-bold text-gray-900 mb-4">💳 Résumé</h3>

                <div className="space-y-3 pb-4 border-b border-gray-100">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>{selectedTicket?.name || 'Sélectionnez un billet'}</span>
                    <span>× {quantity}</span>
                  </div>
                  <div className="flex justify-between text-gray-800 font-medium">
                    <span>Sous-total</span>
                    <span>{subtotal.toLocaleString()} {currencyLabel}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 text-sm">
                      <span>Réduction ({discount}%)</span>
                      <span>−{discountAmount.toLocaleString()} {currencyLabel}</span>
                    </div>
                  )}
                </div>

                <div className="py-4 border-b border-gray-100">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-[#5B7CFF]">
                      {total === 0 ? 'Gratuit' : `${total.toLocaleString()} ${currencyLabel}`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={!selectedTicket || isProcessing}
                  className="w-full mt-6 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {total === 0 ? (
                    <>
                      <TicketIcon size={20} />
                      Obtenir mes billets gratuits
                    </>
                  ) : (
                    <>
                      💳 Procéder au paiement
                    </>
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                  <CheckCircleIcon size={16} className="text-green-500" />
                  <span>Paiement 100% sécurisé</span>
                </div>

                <div className="mt-3 text-center text-xs text-gray-400">
                  En continuant, vous acceptez nos{' '}
                  <Link href="/cgu" className="text-[#5B7CFF] hover:underline">CGU</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
