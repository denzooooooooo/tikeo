'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CheckIcon,
  StarIcon,
  InfoIcon,
  ArrowRightIcon,
} from '@tikeo/ui';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Pour les organisateurs débutants',
    price: 0,
    period: 'gratuit',
    popular: false,
    features: [
      { name: 'Jusqu\'à 50 billets/événement', included: true },
      { name: '1 événement simultané', included: true },
      { name: 'Page d\'événement personnalisée', included: true },
      { name: 'Billetterie en ligne', included: true },
      { name: 'Support par email', included: true },
      { name: 'Outils de promotion basiques', included: true },
      { name: 'Frais de service', included: '3% + 0,50€ par billet' },
      { name: 'Paiements stripe', included: false },
      { name: 'Analytics avancés', included: false },
      { name: 'Outils marketing', included: false },
      { name: 'Support prioritaire', included: false },
    ],
    cta: 'Commencer gratuitement',
    color: 'gray',
  },
  {
    id: 'pro',
    name: 'Professionnel',
    description: 'Pour les organisateurs réguliers',
    price: 29,
    period: 'mois',
    popular: true,
    features: [
      { name: 'Jusqu\'à 5 000 billets/événement', included: true },
      { name: '10 événements simultanés', included: true },
      { name: 'Page d\'événement personnalisée', included: true },
      { name: 'Billetterie en ligne', included: true },
      { name: 'Support par email & chat', included: true },
      { name: 'Outils de promotion avancés', included: true },
      { name: 'Frais de service', included: '2% + 0,30€ par billet' },
      { name: 'Paiements stripe intégrés', included: true },
      { name: 'Analytics avancés', included: true },
      { name: 'Outils marketing', included: true },
      { name: 'Support prioritaire', included: false },
    ],
    cta: 'Essayer 14 jours gratuits',
    color: 'blue',
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Pour les professionnels',
    price: 99,
    period: 'mois',
    popular: false,
    features: [
      { name: 'Billets illimités/événement', included: true },
      { name: 'Événements illimités', included: true },
      { name: 'Page d\'événement premium', included: true },
      { name: 'Billetterie en ligne', included: true },
      { name: 'Support dédié 24/7', included: true },
      { name: 'Outils marketing pro', included: true },
      { name: 'Frais de service', included: '1% + 0,15€ par billet' },
      { name: 'Paiements stripe & PayPal', included: true },
      { name: 'Analytics avancés', included: true },
      { name: 'Outils marketing', included: true },
      { name: 'Support prioritaire', included: true },
    ],
    cta: 'Nous contacter',
    color: 'purple',
  },
];

const faqs = [
  {
    question: 'Quels sont les frais de transaction ?',
    answer: 'Les frais varient selon le plan : 3% + 0,50€ pour Starter, 2% + 0,30€ pour Professionnel, et 1% + 0,15€ pour Business. Ces frais s\'appliquent uniquement aux billets payants.',
  },
  {
    question: 'Puis-je changer de plan à tout moment ?',
    answer: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements prennent effet immédiatement et sont facturés au prorata.',
  },
  {
    question: 'Y a-t-il un engagement minimum ?',
    answer: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler votre abonnement à tout moment sans pénalité.',
  },
  {
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: 'Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), virement bancaire, et pour les plans Business, nous proposons également le paiement par facture.',
  },
  {
    question: 'Le support est-il inclus ?',
    answer: 'Le plan Starter inclut le support par email. Les plans Professionnel et Business bénéficient d\'un support par email et chat en direct, le plan Business ayant accès à un support dédié 24/7.',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticketCount, setTicketCount] = useState<number>(1000);
  const [avgPrice, setAvgPrice] = useState<number>(50);

  const annualDiscount = 0.2; // 20% discount

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Tarifs transparents
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Choisissez le plan qui correspond à vos besoins. Pas de frais cachés, pas de surprise.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-2 flex items-center gap-2">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  billingPeriod === 'monthly'
                    ? 'bg-white text-[#5B7CFF]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-3 rounded-xl font-medium transition-colors ${
                  billingPeriod === 'annual'
                    ? 'bg-white text-[#5B7CFF]'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Annuel
                <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                  -20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {plans.map((plan) => {
            const effectivePrice = billingPeriod === 'annual'
              ? plan.price * 12 * (1 - annualDiscount)
              : plan.price;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-gray-200 hover:border-[#5B7CFF]'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-4 py-1 bg-white text-[#5B7CFF] text-sm font-semibold rounded-full shadow-lg">
                      <StarIcon size={16} />
                      Le plus populaire
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-sm ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className={`text-5xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price === 0 ? '0' : `${Math.round(effectivePrice)}€`}
                    </span>
                    {plan.price > 0 && (
                      <span className={`${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                        /{billingPeriod === 'annual' ? 'an' : plan.period}
                      </span>
                    )}
                  </div>
                  {billingPeriod === 'annual' && plan.price > 0 && (
                    <p className={`text-sm mt-2 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                      Économisez {Math.round(plan.price * 12 * annualDiscount)}€/an
                    </p>
                  )}
                </div>

                <Link
                  href="/dashboard"
                  className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold mb-8 transition-all duration-200 ${
                    plan.popular
                      ? 'bg-white text-[#5B7CFF] hover:bg-gray-100'
                      : 'bg-[#5B7CFF] text-white hover:bg-[#4a6ae5]'
                  }`}
                >
                  {plan.cta}
                  <ArrowRightIcon size={20} />
                </Link>

                <div className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        feature.included
                          ? plan.popular ? 'bg-white/20' : 'bg-green-100'
                          : 'bg-gray-100'
                      }`}>
                        {feature.included ? (
                          <CheckIcon size={14} className={plan.popular ? 'text-white' : 'text-green-600'} />
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                      <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-700'}`}>
                        {typeof feature.included === 'boolean' ? feature.name : feature.included}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Solutions */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vous avez des besoins spécifiques ?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Pour les grandes entreprises, les festivals ou les partenariats stratégiques, nous proposons des solutions personnalisées avec des tarifs préférentiels.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Volume élevé de billets',
                  'Frais de plateforme réduits',
                  'Intégration API personnalisée',
                  'Support dédié',
                  'Contrats annuels',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckIcon size={14} className="text-white" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Parlons-en
                <ArrowRightIcon size={20} />
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-[#5B7CFF] rounded-full opacity-20 blur-3xl"></div>
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold mb-4">Devis personnalisé</h3>
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nom de l'entreprise"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="email"
                      placeholder="Email professionnel"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="text"
                      placeholder="Volume estimé (billets/mois)"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="submit"
                      className="w-full py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      Demander un devis
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="mb-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Calculez vos frais
          </h2>
          <div className="bg-gray-50 rounded-3xl p-8 lg:p-12 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Nombre de billets vendus par mois
                </label>
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B7CFF]"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>100</span>
                  <span className="font-semibold text-[#5B7CFF]">{ticketCount.toLocaleString()} billets</span>
                  <span>50 000+</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Prix moyen du billet
                </label>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={avgPrice}
                  onChange={(e) => setAvgPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5B7CFF]"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>10€</span>
                  <span className="font-semibold text-[#5B7CFF]">{avgPrice}€</span>
                  <span>500€</span>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Starter</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ~{Math.round(ticketCount * avgPrice * 0.03 + ticketCount * 0.50).toLocaleString()}€/mois
                  </p>
                  <p className="text-xs text-gray-400 mt-1">3% + 0,50€ par billet</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm ring-2 ring-[#5B7CFF]">
                  <p className="text-sm text-gray-500 mb-1">Professionnel</p>
                  <p className="text-2xl font-bold text-[#5B7CFF]">
                    ~{Math.round(ticketCount * avgPrice * 0.02 + ticketCount * 0.30).toLocaleString()}€/mois
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2% + 0,30€ par billet</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm">
                  <p className="text-sm text-gray-500 mb-1">Business</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ~{Math.round(ticketCount * avgPrice * 0.01 + ticketCount * 0.15).toLocaleString()}€/mois
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1% + 0,15€ par billet</p>
                </div>
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                * Estimation basée sur {(ticketCount * avgPrice).toLocaleString()}€ de revenus mensuels
              </p>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Économisez <span className="font-bold text-green-600">{Math.round((ticketCount * avgPrice * 0.03 + ticketCount * 0.50) - (ticketCount * avgPrice * 0.01 + ticketCount * 0.15)).toLocaleString()}€</span> en passant au plan Business
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <InfoIcon
                    size={20}
                    className={`text-gray-400 transition-transform ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-600">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

