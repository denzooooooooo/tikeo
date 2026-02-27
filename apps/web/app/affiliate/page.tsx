'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarIcon,
  UsersIcon,
  TrendingUpIcon,
  CheckIcon,
  ArrowRightIcon,
  GiftIcon,
  ChartIcon,
} from '@tikeo/ui';

const benefits = [
  {
    icon: '💰',
    title: 'Commission attractive',
    description: 'Gagnez jusqu\'à 15% sur chaque vente générée',
  },
  {
    icon: '⏰',
    title: 'Paiements rapides',
    description: 'Recevez vos commissions dès le 15 du mois suivant',
  },
  {
    icon: '📈',
    title: 'Potentiel illimité',
    description: 'Plus vous promouvez, plus vous gagnez',
  },
  {
    icon: '🎯',
    title: 'Outils de tracking',
    description: 'Suivez vos performances en temps réel',
  },
];

const commissionTiers = [
  { range: '0-50 ventes/mois', commission: '10%', color: 'gray' },
  { range: '51-150 ventes/mois', commission: '12%', color: 'blue' },
  { range: '151-500 ventes/mois', commission: '15%', color: 'purple' },
  { range: '500+ ventes/mois', commission: '18%', color: 'orange' },
];

const testimonials = [
  {
    name: 'Julie M.',
    role: 'Blogueuse lifestyle',
    result: '2 500€/mois',
    image: 'https://i.pravatar.cc/150?u=julie',
    quote: 'Tikeo est devenu ma source de revenus principale. Mes lecteurs adorent découvrir de nouveaux événements !',
  },
  {
    name: 'Marc D.',
    role: 'Influenceur musique',
    result: '5 000€/mois',
    image: 'https://i.pravatar.cc/150?u=marc',
    quote: 'Les outils d\'affiliation sont super intuitifs et les conversions sont excellentes.',
  },
  {
    name: 'Sophie L.',
    role: 'Community manager',
    result: '1 800€/mois',
    image: 'https://i.pravatar.cc/150?u=sophie',
    quote: 'Parfait pour mon audience. Les billets se vendent très bien !',
  },
];

export default function AffiliatePage() {
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle affiliate application
    console.log('Application submitted:', { email, website });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <GiftIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Programme d&apos;affiliation Tikeo
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Gagnez de l&apos;argent en recommandant les meilleurs événements à votre audience
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">500+</div>
              <div className="text-white/80 text-sm">Affiliés actifs</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">1M€+</div>
              <div className="text-white/80 text-sm">Versés aux affiliés</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">15%</div>
              <div className="text-white/80 text-sm">Commission max</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-3xl lg:text-4xl font-bold text-white mb-1">48h</div>
              <div className="text-white/80 text-sm">Cookie duration</div>
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
        {/* How it works */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#5B7CFF]/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Inscrivez-vous
              </h3>
              <p className="text-gray-600">
                Créez votre compte affilié gratuit et accéder à votre tableau de bord personnalisé.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#5B7CFF]/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Partagez
              </h3>
              <p className="text-gray-600">
                Utilisez nos liens et bannières pour promouvoir des événements sur votre site ou réseaux sociaux.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#5B7CFF]/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Gagnez
              </h3>
              <p className="text-gray-600">
                Recevez une commission pour chaque vente générée via vos liens d&apos;affiliation.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Pourquoi rejoindre notre programme ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Grille de commissions
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {commissionTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-2xl text-center ${
                    index === 2
                      ? 'bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] text-white'
                      : index === 3
                      ? 'bg-gradient-to-br from-orange-400 to-red-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="text-3xl font-bold mb-2">{tier.commission}</div>
                  <div className={`text-sm ${index < 2 ? 'text-gray-600' : 'text-white/90'}`}>
                    {tier.range}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-500 mt-6 text-sm">
              *Commission calculée sur le prix du billet hors frais de service
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Témoignages de nos affiliés
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-white rounded-2xl border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="text-2xl font-bold text-[#5B7CFF]">
                  {testimonial.result}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tools */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Outils à votre disposition
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <ChartIcon className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dashboard analytics</h3>
              <p className="text-gray-600 text-sm mb-4">
                Suivez vos clics, conversions et gains en temps réel
              </p>
              <ul className="space-y-2">
                {[
                  'Statistiques détaillées',
                  'Graphiques de performance',
                  'Export de données',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Liens intelligents</h3>
              <p className="text-gray-600 text-sm mb-4">
                Générez des liens trackés automatiquement
              </p>
              <ul className="space-y-2">
                {[
                  'Liens profonds',
                  'Paramètres UTM',
                  'Rotation de liens',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Assets promotionnels</h3>
              <p className="text-gray-600 text-sm mb-4">
                Bannières, widgets et outils visuels
              </p>
              <ul className="space-y-2">
                {[
                  'Bannières personnalisées',
                  'Widgets événement',
                  'Badges et buttons',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckIcon size={16} className="text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Prêt à commencer ?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Rejoignez notre programme d&apos;affiliation et commencez à générer des revenus passifs.
                </p>
                <ul className="space-y-4">
                  {[
                    'Inscription gratuite',
                    'Accés immédiat aux outils',
                    'Support dédié aux affiliés',
                    'Paiements mensuels',
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon size={14} className="text-white" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl p-8 text-gray-900">
                <h3 className="text-2xl font-bold mb-6">Postulez maintenant</h3>
                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email professionnel
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@votre-site.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Site web / Chaîne
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://votre-site.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Type de traffic
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent">
                      <option>Site web / Blog</option>
                      <option>Chaîne YouTube</option>
                      <option>Page Instagram</option>
                      <option>Compte TikTok</option>
                      <option>Liste email</option>
                      <option>Autre</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Soumettre ma candidature
                    <ArrowRightIcon size={20} />
                  </button>
                </form>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Réponse sous 48h ouvrées
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Questions fréquentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                q: 'Comment suis-je payé ?',
                a: 'Les paiements sont effectués par virement bancaire le 15 de chaque mois pour les commissions du mois précédent. Le seuil de paiement minimum est de 50€.',
              },
              {
                q: 'Quelle est la durée du cookie ?',
                a: 'Notre cookie a une durée de 48 heures. Si un utilisateur clique sur votre lien et achète dans les 48h, vous recevez votre commission.',
              },
              {
                q: 'Puis-je être rémunéré sur les frais de service ?',
                a: 'Non, la commission est calculée uniquement sur le prix du billet hors frais de service et taxes.',
              },
              {
                q: 'Y a-t-il des restrictions sur le type de contenu ?',
                a: 'Oui, nous n&apos;acceptons pas le spam, le contenu pour adulte, ou toute pratique considérée comme frauduleuse.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="bg-gray-50 rounded-2xl overflow-hidden group"
              >
                <summary className="p-6 cursor-pointer font-semibold text-gray-900 flex items-center justify-between">
                  {faq.q}
                  <ArrowRightIcon size={20} className="text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 text-gray-600">{faq.a}</div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

