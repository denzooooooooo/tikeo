'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CookieIcon,
  SettingsIcon,
  ArrowRightIcon,
} from '@tikeo/ui';

const cookieCategories = [
  {
    id: 'essential',
    name: 'Cookies essentiels',
    description: 'Ces cookies sont strictement nécessaires au fonctionnement du site et ne peuvent pas être désactivés.',
    required: true,
    cookies: [
      { name: 'session_id', purpose: 'Gestion de votre session', duration: 'Session' },
      { name: 'csrf_token', purpose: 'Protection contre les attaques CSRF', duration: 'Session' },
      { name: 'language', purpose: 'Mémorisation de votre langue préférée', duration: '1 an' },
    ],
  },
  {
    id: 'analytics',
    name: 'Cookies analytiques',
    description: 'Ces cookies nous aident à comprendre comment vous utilisez notre site pour améliorer votre expérience.',
    required: false,
    cookies: [
      { name: '_ga', purpose: 'Identification unique des utilisateurs', duration: '2 ans' },
      { name: '_gid', purpose: 'Différenciation des utilisateurs', duration: '24 heures' },
      { name: '_gat', purpose: 'Limitation des requêtes', duration: '1 minute' },
    ],
  },
  {
    id: 'marketing',
    name: 'Cookies marketing',
    description: 'Ces cookies sont utilisés pour vous montrer des publicités pertinentes et mesurer leur efficacité.',
    required: false,
    cookies: [
      { name: '_fbp', purpose: 'Suivi des visites Facebook', duration: '3 mois' },
      { name: 'ads/ga-audiences', purpose: 'Reciblage publicitaire Google', duration: 'Session' },
      { name: 'personalization_id', purpose: 'Personnalisation des annonces Twitter', duration: '2 ans' },
    ],
  },
  {
    id: 'functional',
    name: 'Cookies fonctionnels',
    description: 'Ces cookies permettent des fonctionnalités avancées comme les préférences et le partage sur les réseaux sociaux.',
    required: false,
    cookies: [
      { name: 'remember_me', purpose: 'Connexion automatique', duration: '30 jours' },
      { name: 'last_search', purpose: 'Mémorisation de vos recherches', duration: '1 an' },
      { name: 'viewed_events', purpose: 'Historique des événements consultés', duration: '1 an' },
    ],
  },
];

export default function CookiesPage() {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    functional: false,
  });
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleAcceptAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
    setHasInteracted(true);
    // In production, save to localStorage and send to server
  };

  const handleRejectAll = () => {
    setCookiePreferences({
      essential: true,
      analytics: false,
      marketing: false,
      functional: false,
    });
    setHasInteracted(true);
  };

  const handleSavePreferences = () => {
    setHasInteracted(true);
    // In production, save to localStorage and send to server
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <CookieIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Politique de Cookies
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur notre utilisation des cookies et comment les gérer
            </p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Summary */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-12 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Résumé de notre politique
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-[#5B7CFF] mb-2">4</div>
              <div className="text-gray-600">Types de cookies</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-[#5B7CFF] mb-2">1</div>
              <div className="text-gray-600">Type obligatoire</div>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl font-bold text-[#5B7CFF] mb-2">2 ans</div>
              <div className="text-gray-600">Durée maximale</div>
            </div>
          </div>
        </div>

        {/* What are cookies */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Qu&apos;est-ce qu&apos;un cookie ?
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visit
            </p>
            <p>
              <strong>Types de cookies que nous utilisons :</strong>
            </p>
            <ul>
              <li><strong>Cookies de session :</strong> temporaires et supprimés lorsque vous fermez votre navigateur</li>
              <li><strong>Cookies persistants :</strong> restent sur votre appareil jusqu&apos;à leur expiration</li>
              <li><strong>Cookies propriétaires :</strong> créés par Tikeo pour notre propre usage</li>
              <li><strong>Cookies tiers :</strong> créés par nos partenaires (analytics, advertising)</li>
            </ul>
          </div>
        </div>

        {/* Cookie Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Catégories de cookies
          </h2>
          <div className="space-y-4">
            {cookieCategories.map((category) => (
              <div
                key={category.id}
                className={`rounded-2xl border-2 transition-all duration-200 ${
                  showDetails === category.id
                    ? 'border-[#5B7CFF] bg-blue-50/50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <button
                  onClick={() => setShowDetails(showDetails === category.id ? null : category.id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      category.required ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <CookieIcon
                        size={24}
                        className={category.required ? 'text-green-600' : 'text-gray-600'}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                        {category.required && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Obligatoire
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`relative inline-flex items-center cursor-${category.required ? 'not-allowed' : 'pointer'}`}>
                      <input
                        type="checkbox"
                        checked={cookiePreferences[category.id as keyof typeof cookiePreferences]}
                        onChange={() => {
                          if (!category.required) {
                            setCookiePreferences((prev) => ({
                              ...prev,
                              [category.id]: !prev[category.id as keyof typeof prev],
                            }));
                            setHasInteracted(true);
                          }
                        }}
                        disabled={category.required}
                        className="sr-only peer"
                      />
                      <div className={`w-11 h-6 rounded-full transition-colors ${
                        category.required
                          ? 'bg-green-500 peer-checked:bg-green-500'
                          : 'bg-gray-200 peer-checked:bg-[#5B7CFF]'
                      }`}></div>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        cookiePreferences[category.id as keyof typeof cookiePreferences] ? 'translate-x-5' : ''
                      }`}></div>
                    </div>
                    <ArrowRightIcon
                      size={20}
                      className={`text-gray-400 transition-transform ${
                        showDetails === category.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>

                {showDetails === category.id && (
                  <div className="px-6 pb-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500">
                            <th className="pb-3 font-medium">Nom</th>
                            <th className="pb-3 font-medium">Finalité</th>
                            <th className="pb-3 font-medium text-right">Durée</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {category.cookies.map((cookie) => (
                            <tr key={cookie.name} className="border-t border-gray-100">
                              <td className="py-3 font-mono text-[#5B7CFF]">{cookie.name}</td>
                              <td className="py-3 text-gray-600">{cookie.purpose}</td>
                              <td className="py-3 text-right text-gray-500">{cookie.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Manage Cookies */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Gérer vos préférences
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies en cliquant sur le bouton ci-dessous.
          </p>
          
          {!hasInteracted ? (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAcceptAll}
                className="px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Tout accepter
              </button>
              <button
                onClick={handleRejectAll}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={() => {
                  // Scroll to preferences section
                  document.getElementById('preferences')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Personnaliser
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg">
                <span className="text-green-400">✓</span>
                <span>Préférences enregistrées</span>
              </div>
              <button
                onClick={() => setHasInteracted(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Modifier
              </button>
            </div>
          )}
        </div>

        {/* How to disable */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Comment désactiver les cookies ?
          </h2>
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Sur votre navigateur</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Chrome', url: 'https://support.google.com/chrome/answer/95647' },
                  { name: 'Firefox', url: 'https://support.mozilla.org/fr/kb/cookies-informations-sites-enregistrent' },
                  { name: 'Safari', url: 'https://support.apple.com/fr-fr/guide/safari/sfri11471' },
                  { name: 'Edge', url: 'https://support.microsoft.com/fr-fr/microsoft-edge' },
                ].map((browser) => (
                  <a
                    key={browser.name}
                    href={browser.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:border-[#5B7CFF] transition-colors"
                  >
                    <span className="font-medium text-gray-900">{browser.name}</span>
                    <ArrowRightIcon size={16} className="text-[#5B7CFF]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Outils de désinscription</h3>
              <p className="text-gray-600 mb-4">
                Vous pouvez également utiliser des outils de désinscription en ligne :
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.aboutads.info/choices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-[#5B7CFF] transition-colors text-sm"
                >
                  Digital Advertising Alliance
                </a>
                <a
                  href="https://www.youronlinechoices.com/fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white rounded-lg border border-gray-200 hover:border-[#5B7CFF] transition-colors text-sm"
                >
                  Your Online Choices
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Impact of disabling */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Conséquences de la désactivation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
              <h3 className="text-lg font-bold text-red-900 mb-3">Fonctionnalités réduites</h3>
              <ul className="space-y-2 text-red-700">
                <li>• Certaines pages peuvent ne pas fonctionner correctement</li>
                <li>• Vous devrez vous connecter à chaque visite</li>
                <li>• Vos préférences ne seront pas mémorisées</li>
              </ul>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <h3 className="text-lg font-bold text-green-900 mb-3">Protection de la vie privée</h3>
              <ul className="space-y-2 text-green-700">
                <li>• Moins de données collectées sur votre navigation</li>
                <li>• Publicités moins personnalisées</li>
                <li>• Contrôle total sur vos données</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Updates */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Mises à jour de cette politique
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Nous pouvons mettre à jour cette politique de cookies de temps à autre pour refléter :
            </p>
            <ul>
              <li>Des changements dans nos pratiques de cookies</li>
              <li>Des évolutions réglementaires</li>
              <li>De nouvelles technologies ou pratiques</li>
            </ul>
            <p>
              <strong>Dernière mise à jour :</strong> Mars 2024
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Une question sur nos cookies ?
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto">
            Si vous avez des questions concernant notre utilisation des cookies, n&apos;hésitez pas à contacter notre équipe.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/help"
              className="px-6 py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4a6ae5] transition-colors"
            >
              Centre d&apos;aide
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-700 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

