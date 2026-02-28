'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LockIcon, CheckCircleIcon, ArrowLeftIcon } from '@tikeo/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

function getApiBase(url: string) {
  return url.includes('/api/v1') ? url.replace(/\/$/, '') : url.replace(/\/$/, '') + '/api/v1';
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Lien de réinitialisation invalide ou manquant.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${getApiBase(API_URL)}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => router.push('/login'), 3000);
      } else {
        setError(data.message || 'Une erreur est survenue. Le lien est peut-être expiré.');
      }
    } catch {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircleIcon className="text-green-600" size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Mot de passe modifié !</h2>
        <p className="text-gray-600 mb-8">
          Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion…
        </p>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-green-700">✅ Redirection automatique dans 3 secondes…</p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-[#5B7CFF] font-semibold hover:text-[#7B61FF] transition-colors"
        >
          <ArrowLeftIcon size={20} />
          Se connecter maintenant
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
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
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Nouveau mot de passe</h2>
        <p className="text-gray-600">Choisissez un mot de passe sécurisé pour votre compte</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      {!token ? (
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Ce lien de réinitialisation est invalide. Veuillez demander un nouveau lien.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
          >
            Demander un nouveau lien
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" size={20} />
              </div>
              <input
                id="newPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                placeholder="Minimum 8 caractères"
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {newPassword && (
              <div className="mt-2 flex gap-1">
                {[
                  newPassword.length >= 8,
                  /[A-Z]/.test(newPassword),
                  /[0-9]/.test(newPassword),
                  /[^A-Za-z0-9]/.test(newPassword),
                ].map((ok, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${ok ? 'bg-green-500' : 'bg-gray-200'}`}
                  />
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              Utilisez au moins 8 caractères avec majuscules, chiffres et symboles.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" size={20} />
              </div>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-[#5B7CFF] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? 'border-red-300 bg-red-50'
                    : confirmPassword && confirmPassword === newPassword
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-200'
                }`}
                placeholder="Répétez votre mot de passe"
              />
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !token}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Réinitialiser mon mot de passe'
            )}
          </button>
        </form>
      )}

      <p className="text-center text-sm text-gray-600 mt-6">
        <Link
          href="/login"
          className="font-semibold text-[#5B7CFF] hover:text-[#7B61FF] transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeftIcon size={16} />
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          <Suspense fallback={<div className="animate-pulse h-96 bg-gray-100 rounded-2xl" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>

      {/* Right Side - Gradient */}
      <div className="hidden lg:block lg:flex-1 relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-5xl font-bold text-white mb-6">Nouveau départ 🔐</h2>
            <p className="text-xl text-white/90 mb-8">
              Choisissez un mot de passe fort pour sécuriser votre compte Tikeo.
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
                <div className="text-4xl font-bold mb-2">✅</div>
                <div className="text-white/80">Simple</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="text-4xl font-bold mb-2">🛡️</div>
                <div className="text-white/80">Protégé</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
