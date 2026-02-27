import Link from 'next/link';
import Image from 'next/image';

// ── SVG Icons ──────────────────────────────────────────────────────────────────
const CalendarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const TicketIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" />
  </svg>
);
const UsersIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const StarIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const SearchIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
  </svg>
);
const CreditCardIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);
const SmileIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M8 13s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
const CheckCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// ── Stats Section ──────────────────────────────────────────────────────────────
export function HomeStatsSection() {
  const stats = [
    { value: '10K+', label: 'Événements', icon: <CalendarIcon /> },
    { value: '500K+', label: 'Billets vendus', icon: <TicketIcon /> },
    { value: '50K+', label: 'Utilisateurs', icon: <UsersIcon /> },
    { value: '4.9/5', label: 'Satisfaction', icon: <StarIcon /> },
  ];
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 55%, #9D4EDD 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-3">Tikeo en chiffres</h2>
          <p className="text-xl text-white/65">La confiance de milliers d&apos;utilisateurs</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => (
            <div key={s.label} className="group text-center">
              <div className="bg-white/12 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 transform group-hover:scale-105 group-hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-center mb-4 text-white/80">{s.icon}</div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-sm sm:text-base text-white/75 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works Section ───────────────────────────────────────────────────────
export function HomeHowItWorksSection() {
  const steps = [
    { num: '01', title: 'Recherchez', desc: "Trouvez l'événement parfait parmi des milliers de concerts, festivals, spectacles et plus encore.", icon: <SearchIcon />, color: '#5B7CFF' },
    { num: '02', title: 'Réservez', desc: 'Choisissez vos places et payez en toute sécurité en quelques clics. Plusieurs modes de paiement acceptés.', icon: <CreditCardIcon />, color: '#7B61FF' },
    { num: '03', title: 'Profitez', desc: 'Recevez vos billets instantanément et vivez une expérience inoubliable.', icon: <SmileIcon />, color: '#9D4EDD' },
  ];
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #5B7CFF, #7B61FF, #9D4EDD)' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-full mb-4 text-sm font-bold text-[#5B7CFF] border border-[#5B7CFF]/20">
            Simple &amp; Rapide
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Réservez votre prochain événement en 3 étapes simples</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-14 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px" style={{ background: 'linear-gradient(90deg, #5B7CFF, #9D4EDD)' }} />
          {steps.map((step, i) => (
            <div key={step.num} className="relative text-center group">
              <div
                className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 shadow-lg"
                style={{ background: `linear-gradient(135deg, ${step.color}15, ${step.color}30)`, border: `2px solid ${step.color}30`, color: step.color }}
              >
                {step.icon}
                <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg" style={{ background: step.color }}>
                  {i + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-14">
          <Link href="/events" className="btn-cloud inline-flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#5B7CFF]/30" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
            Commencer maintenant
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Organizers Section ─────────────────────────────────────────────────────────
export function HomeOrganizersSection() {
  const organizers = [
    { id: '1', name: 'Live Nation', events: 450, image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80', verified: true },
    { id: '2', name: 'Paris Events', events: 280, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', verified: true },
    { id: '3', name: 'Festival Prod', events: 180, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80', verified: false },
    { id: '4', name: 'Sport Elite', events: 320, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80', verified: true },
  ];
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-full mb-3 text-sm font-bold text-[#5B7CFF] border border-[#5B7CFF]/20">Organisateurs</span>
            <h2 className="text-4xl font-bold text-gray-900">Organisateurs en vedette</h2>
            <p className="text-gray-500 mt-2">Les meilleurs créateurs d&apos;expériences</p>
          </div>
          <Link href="/organizers" className="hidden sm:flex items-center gap-2 px-5 py-3 border-2 border-[#5B7CFF] text-[#5B7CFF] rounded-xl font-semibold hover:bg-[#5B7CFF] hover:text-white transition-all flex-shrink-0">
            Voir tout <ArrowRightIcon />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {organizers.map((org) => (
            <Link key={org.id} href={`/organizers/${org.id}`} className="group">
              <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <Image src={org.image} alt={org.name} fill className="object-cover rounded-full" />
                  {org.verified && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors text-sm">{org.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{org.events} événements</p>
              </div>
            </Link>
          ))}
        </div>
        {/* Become organizer CTA */}
        <div className="mt-12 p-8 rounded-2xl text-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(91,124,255,0.07), rgba(123,97,255,0.07))', border: '1px solid rgba(91,124,255,0.15)' }}>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(91,124,255,0.08) 0%, transparent 70%)' }} />
          <div className="relative">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Vous organisez des événements ?</h3>
            <p className="text-gray-500 mb-6">Rejoignez des milliers d&apos;organisateurs et vendez vos billets facilement</p>
            <Link href="/dashboard/events/create" className="btn-cloud inline-flex items-center gap-2 px-7 py-3.5 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#5B7CFF]/30" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              <PlusIcon />
              Créer mon événement gratuitement
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Final CTA Section ──────────────────────────────────────────────────────────
export function HomeCTASection() {
  const perks = ['Gratuit pour commencer', 'Paiement sécurisé', 'Support 24/7', 'Sans engagement'];
  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #080810 0%, #0f0c1a 100%)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(91,124,255,0.12)' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[100px]" style={{ background: 'rgba(123,97,255,0.12)' }} />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-white/10 bg-white/5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
          <span className="text-sm font-medium text-white/70">Prêt à commencer ?</span>
        </div>
        <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Organisez votre{' '}
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5B7CFF, #A8D4FF)' }}>
            prochain événement
          </span>
        </h2>
        <p className="text-xl text-white/45 mb-10 max-w-2xl mx-auto">
          Créez, gérez et vendez vos billets en quelques clics. Rejoignez des milliers d&apos;organisateurs sur Tikeo.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <Link href="/dashboard/events/create" className="btn-cloud w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-xl text-lg transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#5B7CFF]/30" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
            Créer mon événement
            <ArrowRightIcon />
          </Link>
          <Link href="/events" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 border border-white/20 bg-white/6 text-white font-semibold rounded-xl text-lg hover:bg-white/12 transition-all">
            Explorer les événements
          </Link>
        </div>
        {/* Social proof */}
        <div className="flex flex-wrap items-center justify-center gap-5 text-white/35 text-sm">
          {perks.map((p) => (
            <div key={p} className="flex items-center gap-1.5">
              <CheckCircleIcon />
              <span>{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
