'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SearchIcon,
  MessageIcon,
  PhoneIcon,
  MailIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChatBubbleIcon,
  BookIcon,
  VideoIcon,
  SupportIcon,
} from '@tikeo/ui';

// Mock data - in production, this would come from the API
const categories = [
  {
    id: 'getting-started',
    name: 'Commencer avec Tikeo',
    description: 'Tout ce que vous devez savoir pour débuter',
    icon: '🚀',
    articleCount: 12,
  },
  {
    id: 'tickets',
    name: 'Billets & Réservations',
    description: 'Acheter, vendre et gérer vos billets',
    icon: '🎫',
    articleCount: 24,
  },
  {
    id: 'organizers',
    name: 'Organisateurs',
    description: 'Créer et gérer vos événements',
    icon: '🎪',
    articleCount: 32,
  },
  {
    id: 'payments',
    name: 'Paiements & Remboursements',
    description: 'Moyens de paiement et politique de remboursement',
    icon: '💳',
    articleCount: 15,
  },
  {
    id: 'account',
    name: 'Compte & Sécurité',
    description: 'Gérer votre compte et protéger vos données',
    icon: '🔐',
    articleCount: 18,
  },
  {
    id: 'technical',
    name: 'Problèmes Techniques',
    description: 'Résoudre les erreurs et dysfonctionnements',
    icon: '🔧',
    articleCount: 21,
  },
];

const faqs = [
  {
    id: '1',
    question: 'Comment acheter des billets sur Tikeo ?',
    answer: `Pour acheter des billets sur Tikeo, suivez ces étapes simples :

1. Recherchez l'événement qui vous intéresse en utilisant notre moteur de recherche
2. Sélectionnez la date et le nombre de billets souhaités
3. Choisissez vos places sur le plan de salle (si applicable)
4. Créez un compte ou connectez-vous
5. Sélectionnez votre mode de paiement
6. Validez votre commande et recevez vos billets par email

Vos billets vous seront envoyés instantanément par email et seront également disponibles dans votre compte Tikeo.`,
    category: 'tickets',
  },
  {
    id: '2',
    question: 'Puis-je me faire rembourser mes billets ?',
    answer: `Notre politique de remboursement dépend de l'événement et de l'organisateur :

**Événements éligibles au remboursement :**
- Remboursement possible jusqu'à 7 jours après l'achat
- Événements annulés par l'organisateur
- Événements reportés avec impossibilité de participer

**Événements non éligibles :**
- Billets achetés moins de 48h avant l'événement
- Événements avec politique "pas de remboursement"
- Billets personnalisés ou transférés

Pour demander un remboursement, contactez notre équipe support avec votre numéro de commande.`,
    category: 'payments',
  },
  {
    id: '3',
    question: 'Comment devenir organisateur sur Tikeo ?',
    answer: `Devenir organisateur sur Tikeo est simple et gratuit :

**Conditions préalables :**
- Avoir un compte Tikeo actif
- Être majeur (18 ans et plus)
- Disposer d'un moyen de paiement valide

**Étapes d'inscription :**
1. Connectez-vous à votre compte
2. Accédez à "Devenir organisateur" dans votre tableau de bord
3. Remplissez le formulaire avec vos informations professionnelles
4. Soumettez une pièce d'identité
5. Attendez la validation (48h maximum)

Une fois approuvé, vous pourrez créer et gérer vos événements directement depuis votre dashboard.`,
    category: 'organizers',
  },
  {
    id: '4',
    question: 'Mes billets sont-ils échangeables ?',
    answer: `Oui, les billets Tikeo sont échangeables sous certaines conditions :

**Échanges possibles :**
- Changement de date pour le même événement
- Transfert à une autre personne (gratuit)
- Mise à niveau vers une catégorie supérieure (avec supplément)

**Restrictions :**
- L'échange doit être effectué au moins 24h avant l'événement
- Certains événements ont des billets non échangeables
- Les échanges sont soumis à disponibilité

Pour effectuer un échange, rendez-vous dans "Mes commandes" et sélectionnez "Échanger".`,
    category: 'tickets',
  },
  {
    id: '5',
    question: 'Comment sécuriser mon compte Tikeo ?',
    answer: `Nous vous recommandons ces mesures de sécurité pour protéger votre compte :

**Sécurité obligatoire :**
- Utilisez un mot de passe unique (12+ caractères)
- Activez l'authentification à deux facteurs (2FA)

**Sécurité recommandée :**
- Ne partagez jamais vos identifiants
- Déconnexion après utilisation sur appareil partagé
- Vérifiez régulièrement les connexions actives
- Utilisez un email valide pour la récupération`,
    category: 'account',
  },
  {
    id: '6',
    question: 'Quels moyens de paiement sont acceptés ?',
    answer: `Tikeo accepte plusieurs moyens de paiement :

**Cartes bancaires :** Visa, Mastercard, American Express, Carte Bleue
**Portefeuilles numériques :** Apple Pay, Google Pay, PayPal
**Paiement fractionné :** Klarna (3x sans frais), Alma (jusqu'à 12x)

Tous les paiements sont sécurisés par cryptage SSL.`,
    category: 'payments',
  },
];

const popularArticles = [
  { title: 'Guide Complet pour Acheter vos Billets', views: 15234, slug: 'guide-achat-billets' },
  { title: 'Sécuriser votre Compte Tikeo', views: 12456, slug: 'securiser-compte' },
  { title: 'Créer un Événement qui Attire du Monde', views: 8934, slug: 'creer-evenement-reussite' },
  { title: 'FAQ - Questions Fréquentes', views: 7654, slug: 'faq-general' },
];

function FAQItem({ faq }: { faq: typeof faqs[0] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-semibold text-gray-900">{faq.question}</span>
        {isOpen ? (
          <ChevronUpIcon className="text-[#5B7CFF] flex-shrink-0" size={20} />
        ) : (
          <ChevronDownIcon className="text-gray-400 flex-shrink-0" size={20} />
        )}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 bg-white">
          <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
            {faq.answer}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredFAQs = selectedCategory
    ? faqs.filter((faq) => faq.category === selectedCategory)
    : faqs;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Centre d&apos;aide
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Trouvez rapidement des réponses à vos questions ou contactez notre équipe de support
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-4">
                  <SearchIcon className="text-gray-400 mr-4" size={24} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Recherchez une question, un mot-clé..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-semibold hover:shadow-lg transition-all duration-200">
                  Rechercher
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-white/80 text-sm">Suggestions :</span>
              <button className="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">
                Remboursement
              </button>
              <button className="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">
                Billets
              </button>
              <button className="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">
                Organisateur
              </button>
              <button className="px-3 py-1 bg-white/20 text-white text-sm rounded-full hover:bg-white/30 transition-colors">
                Compte
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
        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Parcourir par catégorie
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className="group text-left p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-[#5B7CFF] hover:shadow-xl transition-all duration-300"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="text-sm text-[#5B7CFF] font-medium">
                  {category.articleCount} articles →
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Questions Fréquentes
            </h2>
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              <option value="tickets">Billets & Réservations</option>
              <option value="payments">Paiements</option>
              <option value="organizers">Organisateurs</option>
              <option value="account">Compte & Sécurité</option>
            </select>
          </div>

          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <FAQItem key={faq.id} faq={faq} />
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <MessageIcon className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucune question trouvée
              </h3>
              <p className="text-gray-600">
                Essayez de sélectionner une autre catégorie ou contactez notre support.
              </p>
            </div>
          )}
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Articles Populaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularArticles.map((article, index) => (
              <Link
                key={index}
                href={`/help/articles/${article.slug}`}
                className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <BookIcon size={16} />
                  <span>{article.views.toLocaleString()} lectures</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[#5B7CFF] transition-colors">
                  {article.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Vous n&apos;avez pas trouvé votre réponse ?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Notre équipe de support est disponible 24h/24, 7j/7 pour vous aider à résoudre tous vos problèmes.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <ChatBubbleIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold">Chat en direct</p>
                    <p className="text-gray-400 text-sm">Réponse en quelques minutes</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <MailIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-400 text-sm">support@tikeo.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                    <PhoneIcon className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold">Téléphone</p>
                    <p className="text-gray-400 text-sm">+33 1 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-6 lg:p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Envoyer un message
              </h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet
                  </label>
                  <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent">
                    <option>Choisir un sujet...</option>
                    <option>Problème avec une commande</option>
                    <option>Question sur un événement</option>
                    <option>Problème technique</option>
                    <option>Suggestion / Feedback</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Décrivez votre problème..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Help Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ressources supplémentaires
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Link
              href="/resources"
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <VideoIcon className="text-[#5B7CFF]" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Tutoriels vidéo</h3>
              <p className="text-gray-600 text-sm">
                Apprenez à utiliser Tikeo en regardant nos guides vidéo
              </p>
            </Link>
            <Link
              href="/blog"
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookIcon className="text-green-500" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Blog Tikeo</h3>
              <p className="text-gray-600 text-sm">
                Actualités, conseils et meilleures pratiques
              </p>
            </Link>
            <Link
              href="/pricing"
              className="group p-6 bg-white rounded-2xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <SupportIcon className="text-orange-500" size={32} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Guide organisateur</h3>
              <p className="text-gray-600 text-sm">
                Tout ce qu&apos;il faut savoir pour organiser vos événements
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

