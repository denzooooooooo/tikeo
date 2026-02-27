'use client';

import React, { useState } from 'react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsSubmitted(true);
    setEmail('');
    setName('');
  };

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c1a 0%, #1a0f2e 40%, #0c1a2e 100%)' }}
    >
      {/* Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(91,124,255,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(123,97,255,0.15) 0%, transparent 70%)' }} />
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(91,124,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,124,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 border border-white/10 bg-white/5">
              <span className="w-2 h-2 bg-[#5B7CFF] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-white/70">Newsletter Tikeo</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              Ne manquez{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #5B7CFF, #A8D4FF)' }}>
                aucun événement
              </span>
            </h2>
            <p className="text-lg text-white/55 mb-10 leading-relaxed">
              Rejoignez plus de <strong className="text-white/80">50 000 passionnés</strong> qui reçoivent chaque semaine les meilleures offres et événements africains.
            </p>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5B7CFF]" style={{ background: 'rgba(91,124,255,0.12)', border: '1px solid rgba(91,124,255,0.2)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <span className="text-white/70 text-sm font-medium">Offres exclusives en avant-première</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5B7CFF]" style={{ background: 'rgba(91,124,255,0.12)', border: '1px solid rgba(91,124,255,0.2)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                </div>
                <span className="text-white/70 text-sm font-medium">Alertes événements près de chez vous</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5B7CFF]" style={{ background: 'rgba(91,124,255,0.12)', border: '1px solid rgba(91,124,255,0.2)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <span className="text-white/70 text-sm font-medium">Codes promo et réductions spéciales</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-[#5B7CFF]" style={{ background: 'rgba(91,124,255,0.12)', border: '1px solid rgba(91,124,255,0.2)' }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                </div>
                <span className="text-white/70 text-sm font-medium">Actualités musique &amp; culture africaine</span>
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {(['#5B7CFF','#7B61FF','#A8D4FF','#FF6B6B','#4ECDC4'] as const).map((color, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#0f0c1a] flex items-center justify-center text-white text-xs font-bold" style={{ background: color }}>
                    {['A','K','M','S','D'][i]}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-0.5">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24" fill="#FBBF24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  ))}
                </div>
                <p className="text-white/45 text-xs">+50 000 abonnés satisfaits</p>
              </div>
            </div>
          </div>

          {/* Right — Form Card */}
          <div>
            <div className="relative rounded-3xl p-8 lg:p-10 overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
              {/* Top glow line */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(91,124,255,0.5), transparent)' }} />

              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)', boxShadow: '0 8px 24px rgba(91,124,255,0.35)' }}>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">Inscrivez-vous gratuitement</h3>
              <p className="text-white/50 text-sm mb-8">Recevez les meilleures offres directement dans votre boîte mail.</p>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.3)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">Merci pour votre inscription !</h4>
                  <p className="text-white/50 text-sm">Vous recevrez bientôt nos meilleures offres.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Prénom</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Votre prénom"
                      className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/30 text-sm font-medium outline-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="text-white/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com"
                        required
                        className="w-full pl-11 pr-4 py-3.5 rounded-xl text-white placeholder-white/30 text-sm font-medium outline-none transition-all"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 rounded-xl font-bold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)', boxShadow: '0 8px 24px rgba(91,124,255,0.35)' }}
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                        Inscription en cours...
                      </>
                    ) : (
                      <>
                        Je m&apos;inscris gratuitement
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Trust badges */}
              <div className="mt-6 pt-6 grid grid-cols-3 gap-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <svg className="text-[#5B7CFF]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  <span className="text-white/40 text-[10px] font-medium leading-tight">100% gratuit</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <svg className="text-[#5B7CFF]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  <span className="text-white/40 text-[10px] font-medium leading-tight">Données sécurisées</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <svg className="text-[#5B7CFF]" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                  <span className="text-white/40 text-[10px] font-medium leading-tight">Désinscription libre</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
