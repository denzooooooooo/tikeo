'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CalendarIcon, ClockIcon, LocationIcon, ArrowLeftIcon, CheckCircleIcon } from '@tikeo/ui';
import { PromoCodeInput } from '@tikeo/ui';
import { StripePaymentForm } from './StripePaymentForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function getAuthToken(): string | null {
  try {
    const s = localStorage.getItem('auth_tokens');
    if (s) return JSON.parse(s).accessToken || null;
  } catch { /* ignore */ }
  return null;
}

interface TicketType { id: string; name: string; price: number; description: string; available?: number; }
interface EventData { id: string; title: string; date: string; time?: string; venue?: string; venueCountry?: string; coverImage?: string; ticketTypes: TicketType[]; status?: string; }
interface GuestInfo { firstName: string; lastName: string; email: string; phone: string; }
type CheckoutStep = 'selection' | 'payment' | 'success';

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
  const [step, setStep] = useState<CheckoutStep>('selection');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderTotal, setOrderTotal] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({ firstName: '', lastName: '', email: '', phone: '' });
  const [guestErrors, setGuestErrors] = useState<Partial<Record<keyof GuestInfo, string>>>({});

  useEffect(() => {
    setIsLoggedIn(!!getAuthToken());
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/events/${eventId}`);
      if (res.ok) {
        const d = await res.json();
        setEvent({
          id: d.id, title: d.title, status: d.status,
          date: d.startDate ? new Date(d.startDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : d.date || '',
          time: d.startDate ? new Date(d.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : d.time || '',
          venue: d.venueName || d.venue || d.location || '',
          venueCountry: d.venueCountry || '',
          coverImage: d.coverImage || 'https://picsum.photos/seed/event/800/400',
          ticketTypes: (d.ticketTypes || d.tickets || []).map((t: any) => ({
            id: t.id, name: t.name || t.type, price: t.price,
            description: t.description || '', available: t.available ?? t.quantity,
          })),
        });
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const handleApplyDiscount = (discountAmount: number) => {
    setDiscount(discountAmount);
  };

  const validateGuest = (): boolean => {
    const errs: Partial<Record<keyof GuestInfo, string>> = {};
    if (!guestInfo.firstName.trim()) errs.firstName = 'Le prénom est obligatoire';
    if (!guestInfo.lastName.trim()) errs.lastName = 'Le nom est obligatoire';
    if (!guestInfo.email.trim()) errs.email = "L'email est obligatoire";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) errs.email = 'Email invalide';
    setGuestErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = async () => {
    if (!selectedTicket || !eventId) return;
    if (!isLoggedIn && !validateGuest()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const token = getAuthToken();
      const body: any = { eventId, ticketTypeId: selectedTicket.id, quantity, promoCode: promoCode || undefined };
      if (!token) {
        body.guestInfo = {
          firstName: guestInfo.firstName.trim(),
          lastName: guestInfo.lastName.trim(),
          email: guestInfo.email.trim(),
          phone: guestInfo.phone.trim() || undefined,
        };
      }
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const orderRes = await fetch(`${API_URL}/orders`, { method: 'POST', headers, body: JSON.stringify(body) });
      if (!orderRes.ok) {
        const e = await orderRes.json().catch(() => ({}));
        throw new Error(e.message || 'Impossible de créer la commande');
      }
      const order = await orderRes.json();
      setOrderId(order.id);
      setOrderTotal(order.total);
      if (order.total === 0) { setStep('success'); return; }
      if (!stripePromise) {
        setError("⚠️ Paiement Stripe non configuré. Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.");
        setIsProcessing(false);
        return;
      }
      const payRes = await fetch(`${API_URL}/payments/create-payment-intent`, {
        method: 'POST', headers, body: JSON.stringify({ orderId: order.id, amount: order.total }),
      });
      if (!payRes.ok) {
        const e = await payRes.json().catch(() => ({}));
        throw new Error(e.message || "Impossible d'initialiser le paiement.");
      }
      const payData = await payRes.json();
      if (!payData.clientSecret) throw new Error('Réponse de paiement invalide');
      setClientSecret(payData.clientSecret);
      setStep('payment');
    } catch (e: any) {
      setError(e.message || 'Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    const c = (event?.venueCountry || '').toLowerCase();
    if (c.includes('nigeria')) return `₦${price.toLocaleString()}`;
    if (c.includes('ghana')) return `GH₵${price.toLocaleString()}`;
    if (c.includes('kenya')) return `KSh ${price.toLocaleString()}`;
    if (c.includes('france') || c.includes('belgique') || c.includes('allemagne') || c.includes('espagne') || c.includes('italie'))
      return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(price);
    if (c.includes('royaume-uni') || c.includes('united kingdom')) return `£${price.toLocaleString()}`;
    if (c.includes('états-unis') || c.includes('united states')) return `$${price.toLocaleString()}`;
    if (c.includes('cameroun') || c.includes('gabon') || c.includes('congo')) return `${price.toLocaleString('fr-FR')} XAF`;
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const subtotal = selectedTicket ? selectedTicket.price * quantity : 0;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {orderTotal === 0 ? 'Inscription confirmée !' : 'Paiement réussi !'}
          </h2>
          <p className="text-gray-600 mb-2">Votre commande a été confirmée.</p>
          {orderId && <p className="text-sm text-gray-400 mb-2">Référence : {orderId}</p>}
          {!isLoggedIn && guestInfo.email && (
            <div className="mt-3 mb-6 p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
              📧 Un email de confirmation a été envoyé à <strong>{guestInfo.email}</strong>
            </div>
          )}
          {isLoggedIn && <div className="mb-6" />}
          <div className="space-y-3">
            {isLoggedIn ? (
              <>
                <button onClick={() => router.push('/orders')} className="w-full bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-3 rounded-xl">
                  Voir mes commandes
                </button>
                <button onClick={() => router.push('/tickets')} className="w-full border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50">
                  Voir mes billets
                </button>
              </>
            ) : (
              <>
                <button onClick={() => router.push('/events')} className="w-full bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-3 rounded-xl">
                  Découvrir d&apos;autres événements
                </button>
                <Link href="/register" className="block w-full border border-[#5B7CFF] text-[#5B7CFF] font-semibold py-3 rounded-xl hover:bg-[#5B7CFF]/5 text-center">
                  Créer un compte pour gérer mes billets
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Événement introuvable</p>
          <Link href="/events" className="text-[#5B7CFF] hover:underline">Retour aux événements</Link>
        </div>
      </div>
    );
  }

  if (event.status && event.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg border border-gray-100">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Événement non disponible</h2>
          <p className="text-gray-500 text-sm mb-6">
            {event.status === 'DRAFT' ? "Cet événement est en brouillon." : "Cet événement n'est plus disponible."}
          </p>
          <Link href="/events" className="inline-block bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-3 px-6 rounded-xl">
            Voir les événements disponibles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          href={step === 'payment' ? '#' : `/events/${eventId}`}
          onClick={step === 'payment' ? (e) => { e.preventDefault(); setStep('selection'); setClientSecret(null); } : undefined}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#5B7CFF] mb-6"
        >
          <ArrowLeftIcon size={20} />
          {step === 'payment' ? 'Retour à la sélection' : "Retour à l'événement"}
        </Link>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-start justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700 flex-shrink-0">✕</button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-8">
          <div className={`flex items-center gap-2 ${step === 'selection' ? 'text-[#5B7CFF] font-bold' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${step === 'selection' ? 'bg-[#5B7CFF] text-white' : 'bg-gray-200 text-gray-500'}`}>1</span>
            <span className="hidden sm:inline">Sélection</span>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
          <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-[#5B7CFF] font-bold' : 'text-gray-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${step === 'payment' ? 'bg-[#5B7CFF] text-white' : 'bg-gray-200 text-gray-500'}`}>2</span>
            <span className="hidden sm:inline">Paiement</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Event summary */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Récapitulatif</h2>
              <div className="flex gap-4">
                <div className="relative w-32 h-24 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={event.coverImage || 'https://picsum.photos/seed/event/800/400'} alt={event.title} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                  <div className="flex items-center gap-2 text-gray-600 mt-1"><CalendarIcon size={16} /><span>{event.date}</span></div>
                  {event.time && <div className="flex items-center gap-2 text-gray-600"><ClockIcon size={16} /><span>{event.time}</span></div>}
                  {event.venue && <div className="flex items-center gap-2 text-gray-600"><LocationIcon size={16} /><span>{event.venue}</span></div>}
                </div>
              </div>
            </div>

            {/* Step 1 */}
            {step === 'selection' && (
              <>
                <div className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Choix des billets</h2>
                  {event.ticketTypes.length === 0 ? (
                    <p className="text-gray-500">Aucun billet disponible.</p>
                  ) : (
                    <div className="space-y-3">
                      {event.ticketTypes.map((ticket) => {
                        const isSoldOut = ticket.available !== undefined && ticket.available <= 0;
                        return (
                          <label key={ticket.id} className={`block p-4 rounded-xl border-2 transition-all ${isSoldOut ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed' : selectedTicket?.id === ticket.id ? 'border-[#5B7CFF] bg-[#5B7CFF]/5 cursor-pointer' : 'border-gray-200 hover:border-gray-300 cursor-pointer'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <input type="radio" name="ticket" checked={selectedTicket?.id === ticket.id} onChange={() => !isSoldOut && setSelectedTicket(ticket)} disabled={isSoldOut} className="w-5 h-5 text-[#5B7CFF]" />
                                <div>
                                  <p className="font-bold text-gray-900">{ticket.name}</p>
                                  {ticket.description && <p className="text-sm text-gray-600">{ticket.description}</p>}
                                  {isSoldOut
                                    ? <p className="text-xs font-semibold text-red-500">Épuisé</p>
                                    : ticket.available !== undefined && ticket.available <= 10
                                    ? <p className="text-xs font-semibold text-orange-500">⚡ Plus que {ticket.available} disponible{ticket.available > 1 ? 's' : ''}</p>
                                    : ticket.available !== undefined
                                    ? <p className="text-xs text-gray-400">{ticket.available} disponibles</p>
                                    : null}
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-bold text-lg ${isSoldOut ? 'text-gray-400' : 'text-[#5B7CFF]'}`}>{formatPrice(ticket.price)}</p>
                                {isSoldOut && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Complet</span>}
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                  {selectedTicket && (selectedTicket.available === undefined || selectedTicket.available > 0) && (
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-xl font-bold">-</button>
                        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(Math.min(quantity + 1, selectedTicket.available ?? 10))} className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-xl font-bold">+</button>
                      </div>
                    </div>
                  )}
                </div>

                <PromoCodeInput onApply={handleApplyDiscount} />

                {/* Guest form */}
                {!isLoggedIn && (
                  <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7CFF" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Vos informations</h2>
                        <p className="text-sm text-gray-500">Nécessaires pour recevoir votre billet par email</p>
                      </div>
                    </div>
                    <div className="mb-5 p-3 bg-gray-50 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-gray-600">Vous avez déjà un compte ?</span>
                      <Link href={`/login?redirect=/events/${eventId}/checkout`} className="text-sm font-semibold text-[#5B7CFF] hover:underline">Se connecter →</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                        <input type="text" value={guestInfo.firstName} onChange={(e) => { setGuestInfo(p => ({ ...p, firstName: e.target.value })); setGuestErrors(p => ({ ...p, firstName: undefined })); }} placeholder="Jean" className={`w-full px-4 py-3 rounded-xl border ${guestErrors.firstName ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] transition-all`} />
                        {guestErrors.firstName && <p className="text-xs text-red-500 mt-1">{guestErrors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                        <input type="text" value={guestInfo.lastName} onChange={(e) => { setGuestInfo(p => ({ ...p, lastName: e.target.value })); setGuestErrors(p => ({ ...p, lastName: undefined })); }} placeholder="Dupont" className={`w-full px-4 py-3 rounded-xl border ${guestErrors.lastName ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] transition-all`} />
                        {guestErrors.lastName && <p className="text-xs text-red-500 mt-1">{guestErrors.lastName}</p>}
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
                        <input type="email" value={guestInfo.email} onChange={(e) => { setGuestInfo(p => ({ ...p, email: e.target.value })); setGuestErrors(p => ({ ...p, email: undefined })); }} placeholder="jean.dupont@email.com" className={`w-full px-4 py-3 rounded-xl border ${guestErrors.email ? 'border-red-400 bg-red-50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] transition-all`} />
                        {guestErrors.email && <p className="text-xs text-red-500 mt-1">{guestErrors.email}</p>}
                        <p className="text-xs text-gray-400 mt-1">Votre billet sera envoyé à cette adresse</p>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-gray-400 font-normal">(optionnel)</span></label>
                        <input type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo(p => ({ ...p, phone: e.target.value }))} placeholder="+33 6 00 00 00 00" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] transition-all" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Step 2: Stripe */}
            {step === 'payment' && clientSecret && stripePromise && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de paiement</h2>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#5B7CFF', borderRadius: '12px' } } }}>
                  <StripePaymentForm orderId={orderId!} amount={orderTotal} onSuccess={() => setStep('success')} onError={setError} />
                </Elements>
              </div>
            )}

            {/* Step 2: No Stripe */}
            {step === 'payment' && !stripePromise && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Paiement Stripe non configuré</h3>
                <p className="text-gray-600 text-sm mb-4">La clé <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> n&apos;est pas configurée.</p>
                <p className="text-xs text-gray-400 mb-6">Référence commande : {orderId}</p>
                <button onClick={() => setStep('success')} className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-3 px-6 rounded-xl">
                  Voir ma commande
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
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
                  <span>{step === 'payment' ? orderTotal.toFixed(2) : total.toFixed(2)}€</span>
                </div>
              </div>

              {step === 'selection' && (
                <button
                  disabled={!selectedTicket || isProcessing || (selectedTicket?.available !== undefined && selectedTicket.available <= 0)}
                  onClick={handleProceedToPayment}
                  className="w-full mt-6 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Préparation...
                    </span>
                  ) : (
                    'Procéder au paiement'
                  )}
                </button>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                <CheckCircleIcon size={16} className="text-green-500" />
                <span>Paiement sécurisé par Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
