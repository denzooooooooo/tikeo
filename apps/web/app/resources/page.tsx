'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookIcon,
  VideoIcon,
  DownloadIcon,
  SearchIcon,
  ArrowRightIcon,
  FileIcon,
  CalculatorIcon,
  LinkIcon,
  CalendarCheckIcon,
  QuestionCircleIcon,
  ChatBubbleCircleIcon,
  NewspaperIcon,
  MailIcon,
} from '@tikeo/ui';

const resources = {
  guides: [
    {
      id: '1',
      title: 'Guide de création d\'événement',
      description: 'Apprenez à créer et publier votre premier événement étape par étape.',
      type: 'PDF',
      pages: 24,
      updatedAt: '2024-03-01',
    },
    {
      id: '2',
      title: 'Stratégies de billetterie',
      description: 'Optimisez vos ventes avec nos conseils d\'experts.',
      type: 'PDF',
      pages: 32,
      updatedAt: '2024-02-15',
    },
    {
      id: '3',
      title: 'Marketing événementiel',
      description: 'Comment promouvoir efficacement votre événement.',
      type: 'PDF',
      pages: 28,
      updatedAt: '2024-01-20',
    },
  ],
  videos: [
    {
      id: 'v1',
      title: 'Tutoriel : Créer un événement en 10 minutes',
      duration: '10:24',
      views: 15420,
      thumbnail: 'https://picsum.photos/seed/video1/400/225',
    },
    {
      id: 'v2',
      title: 'Comment optimiser la billetterie de votre festival',
      duration: '15:30',
      views: 8930,
      thumbnail: 'https://picsum.photos/seed/video2/400/225',
    },
    {
      id: 'v3',
      title: 'Maîtriser le dashboard organisateur',
      duration: '08:45',
      views: 6540,
      thumbnail: 'https://picsum.photos/seed/video3/400/225',
    },
    {
      id: 'v4',
      title: 'Utiliser les codes promo efficacement',
      duration: '06:15',
      views: 4320,
      thumbnail: 'https://picsum.photos/seed/video4/400/225',
    },
  ],
  templates: [
    {
      id: 't1',
      title: 'Template description événement',
      format: 'DOCX',
      size: '156 KB',
      downloads: 2340,
    },
    {
      id: 't2',
      title: 'Checklist organisation événement',
      format: 'XLSX',
      size: '89 KB',
      downloads: 1890,
    },
    {
      id: 't3',
      title: 'Template email promotionnel',
      format: 'HTML',
      size: '45 KB',
      downloads: 1560,
    },
    {
      id: 't4',
      title: 'Affiche événement modèle',
      format: 'PSD',
      size: '12.5 MB',
      downloads: 980,
    },
  ],
  tools: [
    {
      id: 'tool1',
      title: 'Calculateur de prix',
      description: 'Estimez vos revenus en fonction de vos prix et capacité.',
      icon: CalculatorIcon,
    },
    {
      id: 'tool2',
      title: 'Générateur de slug',
      description: 'Créez des URLs optimisées pour le SEO.',
      icon: LinkIcon,
    },
    {
      id: 'tool3',
      title: 'Calendrier marketing',
      description: 'Planifiez vos communications.',
      icon: CalendarCheckIcon,
    },
  ],
};

const categories = [
  { id: 'all', name: 'Tout', count: 24 },
  { id: 'guides', name: 'Guides', count: 8 },
  { id: 'videos', name: 'Vidéos', count: 12 },
  { id: 'templates', name: 'Templates', count: 6 },
];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BookIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ressources Organisateurs
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Guides, tutoriels et outils pour vous aider à créer des événements inoubliables
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
                    placeholder="Rechercher une ressource..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg"
                  />
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-semibold hover:shadow-lg transition-all duration-200">
                  Rechercher
                </button>
              </div>
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
        {/* Quick Access Tools */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Outils rapides
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {resources.tools.map((tool) => (
              <div
                key={tool.id}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="w-14 h-14 mb-4 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tool.icon className="text-[#5B7CFF]" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors mb-2">
                  {tool.title}
                </h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex overflow-x-auto gap-3 pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-[#5B7CFF] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === category.id ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Tutoriels vidéo
            </h2>
            <Link
              href="/blog?category=tutorials"
              className="text-[#5B7CFF] font-semibold hover:underline"
            >
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.videos.map((video) => (
              <div
                key={video.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                      <VideoIcon className="text-[#5B7CFF]" size={32} />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors line-clamp-2 mb-2">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {video.views.toLocaleString()} vues
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Guides & Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Guides */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Guides gratuits
              </h2>
              <Link
                href="/blog?category=guides"
                className="text-[#5B7CFF] font-semibold hover:underline text-sm"
              >
                Voir tout →
              </Link>
            </div>
            <div className="space-y-4">
              {resources.guides.map((guide) => (
                <div
                  key={guide.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileIcon className="text-[#5B7CFF]" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{guide.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{guide.type}</span>
                      <span>{guide.pages} pages</span>
                      <span>Mis à jour {new Date(guide.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  <button className="p-2 text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors">
                    <DownloadIcon size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Templates */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Templates & Modèles
              </h2>
              <button className="text-[#5B7CFF] font-semibold hover:underline text-sm">
                Tout télécharger
              </button>
            </div>
            <div className="space-y-4">
              {resources.templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-[#5B7CFF] hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-[#5B7CFF] font-bold text-sm">{template.format}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{template.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{template.format}</span>
                      <span>{template.size}</span>
                      <span>{template.downloads.toLocaleString()} téléchargements</span>
                    </div>
                  </div>
                  <button className="p-2 text-[#5B7CFF] hover:bg-[#5B7CFF]/10 rounded-lg transition-colors">
                    <DownloadIcon size={20} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-3xl p-8 lg:p-12 text-white mb-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Restez informé des nouveautés
              </h2>
              <p className="text-white/90 text-lg max-w-xl">
                Recevez nos derniers guides, tutoriels et ressources directement dans votre boîte mail.
              </p>
            </div>
            {newsletterSubscribed ? (
              <div className="flex items-center gap-3 text-green-300 bg-white/10 px-6 py-4 rounded-xl">
                <span className="text-xl">✓</span>
                <span className="font-medium">Merci pour votre inscription !</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Votre email..."
                  required
                  className="px-6 py-4 rounded-xl text-gray-900 w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button type="submit" className="px-8 py-4 bg-white text-[#5B7CFF] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                  S&apos;abonner
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Help Section */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Besoin d&apos;aide ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/help"
              className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-[#5B7CFF]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <QuestionCircleIcon className="text-[#5B7CFF]" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Centre d&apos;aide</h3>
              <p className="text-gray-600 text-sm">
                Trouvez des réponses à vos questions
              </p>
            </Link>
            <Link
              href="/contact"
              className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <ChatBubbleCircleIcon className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contacter le support</h3>
              <p className="text-gray-600 text-sm">
                Notre équipe est là pour vous aider
              </p>
            </Link>
            <Link
              href="/blog"
              className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <NewspaperIcon className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Blog</h3>
              <p className="text-gray-600 text-sm">
                Actualités et conseils
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

