'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MailIcon, ArrowLeftIcon, CheckCircleIcon } from '@tikeo/ui';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setError(data.message || 'Une erreur est survenue');
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex">
        {/* Left Side - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-md w-full space-y-8">
            {/* Logo */}
            <div className="text-center">
              <Link href="/" className="inline-block">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">T</span>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] bg-clip-text text-transparent">
                    Tikeo
                  </span>
                </div>
              </Link>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircleIcon className="text-green-600" size={48} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Email envoyé !
              </h2>
              <p className="text-gray-600 mb-8">
                Si un compte existe pour <strong>{email}</strong>, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                <p className="text-sm text-blue-700">
                  💡 N&apos;oubliez pas de vérifier votre dossier de courriers indésirables.
                </p>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-[#5B7CFF] font-semibold hover:text-[#7B61FF] transition-colors"
              >
                <ArrowLeftIcon size={20} />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Image/Gradient */}
        <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          
          <div className="relative h-full flex items-center justify-center p-12">
            <div className="max-w-lg text-center">
              <h2 className="text-5xl font-bold text-white mb-6">
                Mot de passe oublié ?
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Pas de panique ! Nous allons vous aider à récupérer l&apos;accès à votre compte.
              </p>
              <div className="grid grid-cols-2 gap-4 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl font-bold mb-2">🔒</div>
                  <div className="text-white/80">Sécurisé</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                  <div className="text-4xl font-bold mb-2">⚡</div>
                  <div className="text-white/80">Rapide</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Logo & Title */}
          <div className="text-center">
            <Link href="/" className="inline-block">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] bg-clip-text text-transparent">
                  Tikeo
                </span>
              </div>
            </Link>
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h2>
            <p className="text-gray-600">
              Entrez votre email pour recevoir les instructions de réinitialisation
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <MailIcon className="text-gray-400" size={20} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Envoyer les instructions'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600">
            Retour à la{' '}
            <Link
              href="/login"
              className="font-semibold text-[#5B7CFF] hover:text-[#7B61FF] transition-colors"
            >
              page de connexion
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Gradient */}
      <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Mot de passe oublié ?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Pas de panique ! Nous allons vous aider à récupérer l&apos;accès à votre compte en quelques minutes.
            </p>
            <div className="grid grid-cols-2 gap-4 text-white">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">🔒</div>
                <div className="text-white/80">Sécurisé</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">⚡</div>
                <div className="text-white/80">Rapide</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">📧</div>
                <div className="text-white/80">Email</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">💡</div>
                <div className="text-white/80">Astuce</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

