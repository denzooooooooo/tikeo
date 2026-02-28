'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CountrySelector from '../../components/CountrySelector';
import { useGeolocation } from '../../context/GeolocationContext';
import { useAuth } from '../../context/AuthContext';

// Custom SVG Icons
const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const CheckCircleIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { country: geoCountry, countryName } = useGeolocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: geoCountry || 'FR',
    acceptTerms: false,
    acceptNewsletter: true,
    acceptNotifications: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    setIsLoading(true);

    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
      );
      router.push('/dashboard');
    } catch (err: any) {
      const msg = (err?.message || '').toLowerCase();
      if (msg.includes('already') || msg.includes('exists') || msg.includes('conflict') || msg.includes('409')) {
        setError('Un compte existe déjà avec cet email.');
      } else if (
        msg.includes('failed to fetch') ||
        msg.includes('network') ||
        msg.includes('econnrefused') ||
        err?.name === 'TypeError'
      ) {
        setError('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      } else {
        setError(err.message || "Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Faible', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 50, label: 'Moyen', color: 'bg-yellow-500' };
    if (password.length < 14) return { strength: 75, label: 'Bon', color: 'bg-blue-500' };
    return { strength: 100, label: 'Excellent', color: 'bg-green-500' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:flex-1 relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        {/* Decorative Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        
        {/* Content */}
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg">
            <h2 className="text-5xl font-bold text-white mb-6">
              Rejoignez Tikeo
            </h2>
            <p className="text-xl text-white/90 mb-12">
              Créez votre compte et vibrez au rythme des événements
            </p>
            
            <div className="space-y-6">
              {[
                'Accès à des milliers d\'événements',
                'Réservation en quelques clics',
                'Billets numériques sécurisés',
                'Recommandations personnalisées',
              ].map((text, index) => (
                <div key={index} className="flex items-center gap-4 text-white">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="w-5 h-5" />
                  </div>
                  <span className="text-lg">{text}</span>
                </div>
              ))}
            </div>

            {/* Country Benefits */}
            <div className="mt-12 p-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <p className="text-white/80 text-sm mb-2">Basé sur votre position</p>
              <p className="text-white font-semibold text-lg">
                🇫🇷 Découvrir les événements en {countryName}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-md w-full space-y-8 py-12">
          {/* Logo & Title */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center shadow-glow">
                  <span className="text-2xl font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-bold gradient-text">
                  Tikeo
                </span>
              </div>
            </Link>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Créer un compte
            </h2>
            <p className="text-gray-600">
              Commencez votre aventure avec Tikeo
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-200 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                S&apos;inscrire avec Google
              </span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[#5B7CFF] hover:shadow-lg transition-all duration-200 group"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-semibold text-gray-700 group-hover:text-gray-900">
                S&apos;inscrire avec GitHub
              </span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500 font-medium">
                Ou avec votre email
              </span>
            </div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Name Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Prénom
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="glass-input w-full px-4 py-4 rounded-xl text-gray-900 placeholder-gray-400"
                  placeholder="Jean"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="glass-input w-full px-4 py-4 rounded-xl text-gray-900 placeholder-gray-400"
                  placeholder="Dupont"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="glass-input w-full px-4 py-4 rounded-xl text-gray-900 placeholder-gray-400"
                placeholder="votre@email.com"
              />
            </div>

            {/* Country Selector */}
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                Pays <span className="text-gray-400 font-normal">(pour des recommandations personnalisées)</span>
              </label>
              <CountrySelector
                value={formData.country}
                onChange={(code) => setFormData({ ...formData, country: code })}
                size="md"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="glass-input w-full px-4 pr-12 py-4 rounded-xl text-gray-900 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Force du mot de passe</span>
                    <span className={`text-xs font-semibold ${strength.strength >= 75 ? 'text-green-600' : strength.strength >= 50 ? 'text-blue-600' : strength.strength >= 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.strength}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="glass-input w-full px-4 pr-12 py-4 rounded-xl text-gray-900 placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>

            {/* Newsletter & Notifications */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptNewsletter}
                  onChange={(e) => setFormData({ ...formData, acceptNewsletter: e.target.checked })}
                  className="mt-1 h-4 w-4 text-[#5B7CFF] focus:ring-[#5B7CFF] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  Recevoir la newsletter avec les événements {countryName}
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptNotifications}
                  onChange={(e) => setFormData({ ...formData, acceptNotifications: e.target.checked })}
                  className="mt-1 h-4 w-4 text-[#5B7CFF] focus:ring-[#5B7CFF] border-gray-300 rounded"
                />
                <span className="text-sm text-gray-600">
                  Être notifié des événements près de chez vous
                </span>
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="h-4 w-4 mt-1 text-[#5B7CFF] focus:ring-[#5B7CFF] border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
                J&apos;accepte les{' '}
                <Link href="/terms" className="font-semibold text-[#5B7CFF] hover:text-[#7B61FF]">
                  conditions d&apos;utilisation
                </Link>
                {' '}et la{' '}
                <Link href="/privacy" className="font-semibold text-[#5B7CFF] hover:text-[#7B61FF]">
                  politique de confidentialité
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-bold hover:shadow-glow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Créer mon compte
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#5B7CFF] hover:text-[#7B61FF] transition-colors"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

