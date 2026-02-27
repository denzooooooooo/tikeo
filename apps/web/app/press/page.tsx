'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  PressIcon,
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  FileIcon,
  ArrowRightIcon,
  PhotoIcon,
  DocumentIcon,
} from '@tikeo/ui';

const pressReleases = [
  {
    id: '1',
    title: 'Tikeo lève 10 millions d\'euros pour accélérer son développement en Europe',
    date: '2024-03-15',
    category: 'Finance',
    summary: 'La plateforme de billetterie annonce une levée de fonds majeure pour financer son expansion internationale.',
  },
  {
    id: '2',
    title: 'Tikeo dépasse les 10 millions de billets vendus',
    date: '2024-02-20',
    category: 'Milestone',
    summary: 'Une année record pour la plateforme qui enregistre une croissance de 150%.',
  },
  {
    id: '3',
    title: 'Nouveau partenariat avec les plus grands festivals français',
    date: '2024-01-10',
    category: 'Partnership',
    summary: 'Tikeo devient le partenaire officiel de plusieurs festivals majeurs.',
  },
];

const mediaAssets = {
  logos: [
    { name: 'Logo principal', url: '/logo.png', format: 'PNG, SVG' },
    { name: 'Logo blanc', url: '/logo-white.png', format: 'PNG, SVG' },
    { name: 'Logo.icône', url: '/logo-icon.png', format: 'PNG' },
  ],
  photos: [
    { name: 'Équipe dirigeante', count: 5 },
    { name: 'Bureaux Paris', count: 8 },
    { name: 'Événements', count: 15 },
  ],
  brand: [
    { name: 'Charte graphique', url: '/brand-guide.pdf' },
    { name: 'Couleurs (HEX/RGB)', url: '/colors.pdf' },
  ],
};

const contactInfo = {
  press: {
    name: 'Sarah Martin',
    role: 'Responsable Relations Presse',
    email: 'press@tikeo.com',
    phone: '+33 1 23 45 67 89',
  },
};

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <PressIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Espace Presse
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Toutes les ressources et informations pour les journalistes et médias
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Tikeo */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                À propos de Tikeo
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Fondée en 2022, Tikeo est devenue la plateforme de billetterie événementielle 
                  de référence en France et en Europe. Notre mission : démocratiser l&apos;accès aux 
                  événements culturels et sportifs pour tous.
                </p>
                <p>
                  En 2024, nous avons facilité la vente de plus de 10 millions de billets pour 
                  des événements allant des concerts intimes aux festivals internationaux.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-3xl font-bold text-[#5B7CFF]">10M+</div>
                  <div className="text-gray-600 text-sm">Billets vendus</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-gray-600 text-sm">Organisateurs</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="text-3xl font-bold text-green-600">99.9%</div>
                  <div className="text-gray-600 text-sm">Disponibilité</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl">
                  <div className="text-3xl font-bold text-orange-600">15+</div>
                  <div className="text-gray-600 text-sm">Pays</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-3xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl flex items-center justify-center">
                  <span className="text-6xl font-bold text-white">T</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Communiqués de presse
          </h2>
          <div className="space-y-4">
            {pressReleases.map((release) => (
              <Link
                key={release.id}
                href={`/press/${release.id}`}
                className="block p-6 bg-white rounded-2xl border border-gray-200 hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-[#5B7CFF]/10 text-[#5B7CFF] text-sm font-medium rounded-full">
                        {release.category}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(release.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {release.title}
                    </h3>
                    <p className="text-gray-600">{release.summary}</p>
                  </div>
                  <ArrowRightIcon className="text-[#5B7CFF] flex-shrink-0 ml-4" size={24} />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Media Assets */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Ressources médias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logos */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PhotoIcon className="text-[#5B7CFF]" size={24} />
                Logos
              </h3>
              <div className="space-y-3">
                {mediaAssets.logos.map((logo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-xl"
                  >
                    <span className="text-sm text-gray-700">{logo.name}</span>
                    <span className="text-xs text-gray-500">{logo.format}</span>
                  </div>
                ))}
                <button className="w-full py-3 mt-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <DownloadIcon size={16} />
                  Tout télécharger
                </button>
              </div>
            </div>

            {/* Photos */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <PhotoIcon className="text-[#5B7CFF]" size={24} />
                Photos
              </h3>
              <div className="space-y-3">
                {mediaAssets.photos.map((photo, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-xl"
                  >
                    <span className="text-sm text-gray-700">{photo.name}</span>
                    <span className="text-xs text-gray-500">{photo.count} photos</span>
                  </div>
                ))}
                <button className="w-full py-3 mt-2 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors text-sm font-medium flex items-center justify-center gap-2">
                  <DownloadIcon size={16} />
                  Tout télécharger
                </button>
              </div>
            </div>

            {/* Brand Guidelines */}
            <div className="p-6 bg-gray-50 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DocumentIcon className="text-[#5B7CFF]" size={24} />
                Charte graphique
              </h3>
              <div className="space-y-3">
                {mediaAssets.brand.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-50"
                  >
                    <span className="text-sm text-gray-700">{item.name}</span>
                    <DownloadIcon className="text-[#5B7CFF]" size={18} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Équipe dirigeante
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie Dupont',
                role: 'CEO & Co-founder',
                bio: 'Ancienne Directrice des Opérations chez Vente-Privée, 15 ans d\'expérience dans le e-commerce.',
              },
              {
                name: 'Thomas Martin',
                role: 'CTO & Co-founder',
                bio: 'Ex-Google, spécialiste des systèmes distribués et de la scalabilité.',
              },
              {
                name: 'Sophie Bernard',
                role: 'Head of Growth',
                bio: '10 ans en marketing digital, experte en croissance B2C.',
              },
            ].map((leader, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={`https://i.pravatar.cc/150?u=${leader.name.replace(' ', '')}`}
                    alt={leader.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-1">
                  {leader.name}
                </h3>
                <p className="text-[#5B7CFF] text-center text-sm font-medium mb-3">
                  {leader.role}
                </p>
                <p className="text-gray-600 text-sm text-center">{leader.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Contact Presse
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Pour toute demande d&apos;interview, d&apos;information ou de partenariat média, 
                  notre équipe est à votre disposition.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <MailIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{contactInfo.press.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                      <PhoneIcon className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Téléphone</p>
                      <p className="font-medium">{contactInfo.press.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <h3 className="text-xl font-bold mb-4">{contactInfo.press.name}</h3>
                <p className="text-gray-400 mb-4">{contactInfo.press.role}</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                    <Image
                      src="https://i.pravatar.cc/150?u=sarah"
                      alt={contactInfo.press.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contact dédié</p>
                    <p className="font-medium">{contactInfo.press.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

