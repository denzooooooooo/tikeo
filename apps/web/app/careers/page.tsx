'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BriefcaseIcon,
  ArrowRightIcon,
  MapPinIcon,
  ClockIcon,
  DollarIcon,
  WalletIcon,
  HomeIcon,
  HealthIcon,
  RestaurantIcon,
  BookOpenIcon,
  CelebrationIcon,
  SparklesIcon,
  HandshakeIcon,
  HeartCircleIcon,
  StarCircleIcon,
  SearchIcon,
} from '@tikeo/ui';

const jobs = [
  {
    id: '1',
    title: 'Développeur Frontend React',
    department: 'Engineering',
    location: 'Paris, France',
    type: 'CDI',
    experience: '3-5 ans',
    salary: '50k-70k€',
    remote: 'Hybride',
    description: 'Nous cherchons un développeur Frontend expérimenté pour rejoindre notre équipe et améliorer notre plateforme.',
    requirements: [
      'Maîtrise de React et Next.js',
      'Expérience avec TypeScript',
      'Connaissance de Tailwind CSS',
      'Sens du détail et UX',
    ],
  },
  {
    id: '2',
    title: 'Product Manager',
    department: 'Product',
    location: 'Paris, France',
    type: 'CDI',
    experience: '5+ ans',
    salary: '60k-80k€',
    remote: 'Hybride',
    description: 'Vous serez responsable de la roadmap produit et de l\'amélioration continue de notre plateforme.',
    requirements: [
      'Expérience en gestion de produit tech',
      'Capacité à prioriser',
      'Excellente communication',
      'Orientation utilisateur',
    ],
  },
  {
    id: '3',
    title: 'Designer UX/UI',
    department: 'Design',
    location: 'Paris, France',
    type: 'CDI',
    experience: '2-4 ans',
    salary: '45k-60k€',
    remote: 'Hybride',
    description: 'Venez créer des expériences utilisateur exceptionnelles pour des millions de spectateurs.',
    requirements: [
      'Maîtrise de Figma',
      'Portfolio impressive',
      'Connaissance des principes UX',
      'Capacité à prototyper',
    ],
  },
  {
    id: '4',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Paris, France',
    type: 'CDI',
    experience: '2-4 ans',
    salary: '40k-50k€',
    remote: 'Hybride',
    description: 'Vous accompagnerez nos clients professionnels dans leur réussite sur notre plateforme.',
    requirements: [
      'Excellentes compétences relationnelles',
      'Capacité à résoudre des problèmes',
      'Anglais courant',
      'Experience B2B',
    ],
  },
  {
    id: '5',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Paris, France',
    type: 'CDI',
    experience: '4-6 ans',
    salary: '50k-65k€',
    remote: 'Hybride',
    description: 'Développez notre marque et attirez de nouveaux utilisateurs et organisateurs.',
    requirements: [
      'Experience en growth marketing',
      'Connaissance du digital',
      'Créativité',
      'Capacité d\'analyse',
    ],
  },
];

const benefits = [
  {
    icon: WalletIcon,
    title: 'Rémunération compétitive',
    description: 'Salaire attractif avec participation et BSPCE',
  },
  {
    icon: HomeIcon,
    title: 'Flexibilité',
    description: 'Télétravail hybride et horaires flexibles',
  },
  {
    icon: HealthIcon,
    title: 'Santé & Bien-être',
    description: 'Mutuelle premium et séances de coaching',
  },
  {
    icon: RestaurantIcon,
    title: 'Avantages',
    description: 'Tickets restaurant et allocations diverses',
  },
  {
    icon: BookOpenIcon,
    title: 'Formation',
    description: 'Budget formation et conférences',
  },
  {
    icon: CelebrationIcon,
    title: 'Événements',
    description: 'Team buildings et afterworks réguliers',
  },
];

const values = [
  {
    icon: SparklesIcon,
    title: 'Innovation',
    description: 'Nous repoussons constamment les limites de ce qui est possible',
  },
  {
    icon: HandshakeIcon,
    title: 'Collaboration',
    description: 'Chaque voix compte et chaque idée est valorisée',
  },
  {
    icon: HeartCircleIcon,
    title: 'Passion',
    description: 'Nous aimons ce que nous faisons et le faisons bien',
  },
  {
    icon: StarCircleIcon,
    title: 'Excellence',
    description: 'Nous visons le meilleur dans tout ce que nous entreprenons',
  },
];

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const departments = ['all', ...Array.from(new Set(jobs.map(job => job.department)))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <BriefcaseIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Rejoignez l&apos;équipe Tikeo
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Construisons ensemble le futur de la billetterie événementielle. 
              Venez relever de nouveaux défis et laisser votre empreinte !
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl font-bold text-white mb-1">50+</div>
              <div className="text-white/80 text-sm">Collaborateurs</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl font-bold text-white mb-1">2022</div>
              <div className="text-white/80 text-sm">Création</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl font-bold text-white mb-1">10M+</div>
              <div className="text-white/80 text-sm">Billets vendus</div>
            </div>
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl">
              <div className="text-4xl font-bold text-white mb-1">4.9</div>
              <div className="text-white/80 text-sm">Note Glassdoor</div>
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
        {/* Our Values */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos valeurs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-6 bg-gray-50 rounded-2xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-2xl flex items-center justify-center">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos avantages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-[#5B7CFF]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="text-[#5B7CFF]" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Postes ouverts
          </h2>
          
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un poste..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedDepartment === dept
                      ? 'bg-[#5B7CFF] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept === 'all' ? 'Tous les départements' : dept}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun poste ne correspond à votre recherche.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedDepartment('all'); }}
                  className="mt-4 text-[#5B7CFF] font-medium hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white rounded-2xl border-2 transition-all duration-200 ${
                    selectedJob === job.id
                      ? 'border-[#5B7CFF] shadow-lg'
                      : 'border-gray-200 hover:border-[#5B7CFF]'
                  }`}
                >
                  <button
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    className="w-full flex flex-col lg:flex-row lg:items-center justify-between p-6 text-left"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <span className="px-3 py-1 bg-[#5B7CFF]/10 text-[#5B7CFF] text-sm font-medium rounded-full">
                          {job.department}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPinIcon size={16} />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon size={16} />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarIcon size={16} />
                          {job.salary}
                        </span>
                        <span className="flex items-center gap-1">
                          <BriefcaseIcon size={16} />
                          {job.remote}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 lg:mt-0">
                      <ArrowRightIcon
                        size={24}
                        className={`text-gray-400 transition-transform ${
                          selectedJob === job.id ? 'rotate-90' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {selectedJob === job.id && (
                    <div className="px-6 pb-6 border-t border-gray-100 pt-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-4">Description du poste</h4>
                          <p className="text-gray-600 mb-4">{job.description}</p>
                          <h4 className="font-bold text-gray-900 mb-3">Prérequis</h4>
                          <ul className="space-y-2">
                            {job.requirements.map((req, index) => (
                              <li key={index} className="flex items-center gap-2 text-gray-600">
                                <span className="w-2 h-2 bg-[#5B7CFF] rounded-full"></span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex flex-col justify-end">
                          <Link
                            href={`/careers/${job.id}`}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            Postuler maintenant
                            <ArrowRightIcon size={20} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Culture CTA */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 lg:p-12 text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                  Vous ne trouvez pas votre bonheur ?
                </h2>
                <p className="text-gray-400 text-lg mb-8">
                  Nous sommes toujours à la recherche de talents. Envoyez-nous votre CV spontané !
                </p>
                <a
                  href="mailto:jobs@tikeo.com"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Envoyez votre CV
                  <ArrowRightIcon size={20} />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                  <CelebrationIcon className="text-white/60" size={48} />
                </div>
                <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                  <SparklesIcon className="text-white/60" size={48} />
                </div>
                <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                  <RestaurantIcon className="text-white/60" size={48} />
                </div>
                <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                  <HeartCircleIcon className="text-white/60" size={48} />
                </div>
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
                q: 'Quel est le processus de recrutement ?',
                a: 'Postulez en ligne, entretien RH, entretien technique, et enfin entretien avec le équipe. Le processus prend généralement 2-3 semaines.',
              },
              {
                q: 'Proposez-vous des stages ?',
                a: 'Oui, nous proposons des stages de fin d\'étude dans nos équipes techniques et produit. Postulez via notre formulaire de candidature spontanée.',
              },
              {
                q: 'Le télétravail est-il possible ?',
                a: 'Nous avons une politique hybride : 2-3 jours de télétravail par semaine, avec possibilité de travailler entièrement à distance pour certains postes.',
              },
              {
                q: 'Quelles sont les perspectives d\'évolution ?',
                a: 'Nous encourageons la progression interne. De nombreux collaborateurs ont évolué vers des postes de lead ou management.',
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

