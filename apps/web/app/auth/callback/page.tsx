'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Connexion en cours...');

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const provider = searchParams.get('provider') || 'oauth';
    const error = searchParams.get('error');

    if (error) {
      setStatus('error');
      setMessage(
        error === 'oauth_failed'
          ? 'La connexion OAuth a échoué. Veuillez réessayer.'
          : 'Une erreur est survenue lors de la connexion.'
      );
      setTimeout(() => router.push('/login'), 3000);
      return;
    }

    if (!accessToken || !refreshToken) {
      setStatus('error');
      setMessage('Tokens manquants. Redirection vers la connexion...');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    try {
      // Stocker les tokens dans localStorage (même format que AuthContext)
      const tokens = { accessToken, refreshToken };
      localStorage.setItem('auth_tokens', JSON.stringify(tokens));

      // Décoder le JWT pour obtenir les infos utilisateur
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const user = {
        id: payload.sub,
        email: payload.email,
        firstName: payload.firstName || payload.name?.split(' ')[0] || '',
        lastName: payload.lastName || payload.name?.split(' ')[1] || '',
        role: payload.role || 'USER',
        avatar: payload.avatar || payload.picture || null,
      };
      localStorage.setItem('auth_user', JSON.stringify(user));

      setStatus('success');
      setMessage(`Connexion ${provider} réussie ! Redirection...`);

      // Déclencher un événement pour que AuthContext se mette à jour
      window.dispatchEvent(new Event('storage'));

      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setStatus('error');
      setMessage('Erreur lors du traitement des tokens. Veuillez réessayer.');
      setTimeout(() => router.push('/login'), 3000);
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
            >
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <span
              className="text-2xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tikeo
            </span>
          </div>

          {status === 'loading' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 border-4 border-[#5B7CFF]/20 border-t-[#5B7CFF] rounded-full animate-spin" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connexion en cours</h2>
              <p className="text-gray-500 text-sm">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Connexion réussie !</h2>
              <p className="text-gray-500 text-sm">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Erreur de connexion</h2>
              <p className="text-red-600 text-sm mb-4">{message}</p>
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 text-white font-semibold rounded-xl text-sm"
                style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}
              >
                Retour à la connexion
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-[#5B7CFF]/20 border-t-[#5B7CFF] rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
