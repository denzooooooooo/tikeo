'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

// ─── Icônes SVG inline ───────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GithubIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Validation email ─────────────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailError = touched.email && formData.email && !isValidEmail(formData.email)
    ? 'Veuillez entrer une adresse email valide'
    : '';
  const passwordError = touched.password && formData.password && formData.password.length < 6
    ? 'Le mot de passe doit contenir au moins 6 caractères'
    : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation manuelle
    if (!formData.email || !isValidEmail(formData.email)) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      router.push('/dashboard');
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('credentials') || msg.includes('invalid') || msg.includes('incorrect') || msg.includes('wrong')) {
        setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.');
      } else if (msg.includes('not found') || msg.includes('introuvable')) {
        setError('Aucun compte trouvé avec cet email.');
      } else if (
        msg.includes('failed to fetch') ||
        msg.includes('network') ||
        msg.includes('fetch') ||
        msg.includes('pattern') ||
        msg.includes('string did not') ||
        msg.includes('econnrefused') ||
        msg.includes('connection refused') ||
        msg.includes('networkerror') ||
        msg === '' ||
        err?.name === 'TypeError'
      ) {
        setError('Impossible de se connecter au serveur API. Assurez-vous que le serveur est démarré sur le port 3000.');
      } else {
        setError('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/${provider}`;
  };

  return (
    <div className="min-h-screen flex">
      {/* ── FORMULAIRE ── */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-7">

          {/* Logo */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                  <span className="text-2xl font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Tikeo
                </span>
              </div>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-1">Bon retour !</h2>
            <p className="text-gray-500 text-sm">Connectez-vous pour accéder à votre compte</p>
          </div>

          {/* OAuth */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuthLogin('google')}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all font-semibold text-gray-700 hover:text-gray-900"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
            <button
              type="button"
              onClick={() => handleOAuthLogin('github')}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all font-semibold text-gray-700 hover:text-gray-900"
            >
              <GithubIcon />
              Continuer avec GitHub
            </button>
          </div>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400 font-medium">Ou avec votre email</span>
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">

            {/* Erreur globale */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" x2="12" y1="8" y2="12" />
                  <line x1="12" x2="12.01" y1="16" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <MailIcon />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl transition-all text-gray-900 placeholder-gray-400 outline-none text-sm ${
                    emailError
                      ? 'border-red-300 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-[#5B7CFF] bg-white'
                  }`}
                  placeholder="votre@email.com"
                />
              </div>
              {emailError && <p className="mt-1.5 text-xs text-red-600">{emailError}</p>}
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <LockIcon />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl transition-all text-gray-900 placeholder-gray-400 outline-none text-sm ${
                    passwordError
                      ? 'border-red-300 focus:border-red-400 bg-red-50'
                      : 'border-gray-200 focus:border-[#5B7CFF] bg-white'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {passwordError && <p className="mt-1.5 text-xs text-red-600">{passwordError}</p>}
            </div>

            {/* Se souvenir + Mot de passe oublié */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#5B7CFF] focus:ring-[#5B7CFF] cursor-pointer"
                />
                <span className="text-sm text-gray-600">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-sm font-semibold text-[#5B7CFF] hover:text-[#7B61FF] transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 text-white rounded-xl font-bold transition-all hover:opacity-90 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 text-sm"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* Lien inscription */}
          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{' '}
            <Link href="/register" className="font-bold text-[#5B7CFF] hover:text-[#7B61FF] transition-colors">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>

      {/* ── CÔTÉ DROIT — Visuel africain ── */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 50%, #9D4EDD 100%)' }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />

        {/* Blobs décoratifs */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col items-center justify-center p-12 text-center w-full">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.2" opacity="0.9">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            La billetterie<br />de l&apos;Afrique
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-sm">
            Découvrez et réservez les meilleurs événements à travers tout le continent africain
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-10">
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">12+</div>
              <div className="text-white/70 text-xs">Pays africains</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">500K+</div>
              <div className="text-white/70 text-xs">Billets vendus</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-white/70 text-xs">Événements</div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 text-white">
              <div className="text-2xl font-bold">4.9/5</div>
              <div className="text-white/70 text-xs">Satisfaction</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 w-full max-w-sm">
            {[
              'Paiement en FCFA, NGN, GHS, KES',
              'Billets QR Code sécurisés',
              'Support en français et anglais',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-white/90 text-sm">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-white">
                  <CheckIcon />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
