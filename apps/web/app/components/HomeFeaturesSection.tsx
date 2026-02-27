export default function HomeFeaturesSection() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
      title: 'Paiement 100% sécurisé',
      desc: 'Transactions chiffrées SSL, remboursement garanti. Votre argent est protégé à chaque étape.',
      accent: '#5B7CFF',
      glow: 'rgba(91,124,255,0.25)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: 'Billets instantanés',
      desc: "Recevez vos billets en quelques secondes par email et sur l'application mobile.",
      accent: '#f59e0b',
      glow: 'rgba(245,158,11,0.25)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: 'Événements partout',
      desc: 'Plus de 10 000 événements dans 5 pays. Concerts, festivals, sports, culture et plus.',
      accent: '#10b981',
      glow: 'rgba(16,185,129,0.25)',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: 'Expérience unique',
      desc: 'Découvrez des événements personnalisés selon vos goûts et votre localisation.',
      accent: '#ec4899',
      glow: 'rgba(236,72,153,0.25)',
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a0608 0%, #160a10 50%, #0a0608 100%)' }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(139,0,0,0.18) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 border border-red-900/40 bg-red-950/30">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-300/80">Pourquoi choisir Tikeo</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-5 leading-tight">
            La plateforme{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #ff6b6b, #ee0979)' }}>
              de référence
            </span>
          </h2>
          <p className="text-lg text-white/40 max-w-xl mx-auto">
            Des milliers d&apos;organisateurs et de spectateurs nous font confiance chaque jour
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="group relative p-7 rounded-2xl border transition-all duration-500 hover:-translate-y-2 card-shine cursor-default"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ boxShadow: `0 0 35px ${f.glow}, inset 0 0 35px ${f.glow.replace('0.25', '0.04')}`, border: `1px solid ${f.glow.replace('0.25', '0.4')}` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${f.accent}20, ${f.accent}35)`, color: f.accent, border: `1px solid ${f.accent}30` }}
              >
                {f.icon}
              </div>

              <h3 className="text-base font-bold text-white mb-3">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>

              {/* Bottom accent */}
              <div
                className="absolute bottom-0 left-7 right-7 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${f.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-5">
          <span className="text-white/25 text-sm font-medium">Ils nous font confiance :</span>
          {['Stripe', 'AWS', 'Vercel', 'OpenAI', 'Google'].map((brand) => (
            <div key={brand} className="px-5 py-2.5 rounded-xl text-white/50 font-semibold text-sm border border-white/8 bg-white/4 hover:bg-white/8 hover:text-white/80 transition-all cursor-default">
              {brand}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
