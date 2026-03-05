'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface DebugInfo {
  emailConfigured: boolean;
  emailProvider: string;
  emailFrom: string;
  resendConfigured: boolean;
  smtpHost?: string;
  smtpPort?: string;
  smtpFrom?: string;
  emailSent?: boolean;
  emailResult?: {
    success: boolean;
    messageId?: string;
    error?: string;
  };
  timestamp: string;
}

export default function DebugEmailPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);

  const checkConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/health`);
      const data = await res.json();
      setDebugInfo({
        emailConfigured: data.emailConfigured || false,
        emailProvider: data.emailProvider || 'none',
        emailFrom: data.emailFrom,
        resendConfigured: data.resendConfigured || false,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort?.toString(),
        smtpFrom: data.smtpFrom,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      setDebugInfo({
        emailConfigured: false,
        emailProvider: 'none',
        emailFrom: '',
        resendConfigured: false,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;
    setSending(true);
    try {
      const res = await fetch(`${API_URL}/health/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();
      setDebugInfo((prev) => prev ? {
        ...prev,
        emailSent: true,
        emailResult: data,
      } : null);
    } catch (e: any) {
      setDebugInfo((prev) => prev ? {
        ...prev,
        emailSent: true,
        emailResult: { success: false, error: e.message },
      } : null);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🔧 Debug Email</h1>

        {/* Configuration Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📧 Configuration Email</h2>
          
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#5B7CFF] rounded-full animate-spin" />
              Chargement...
            </div>
          ) : debugInfo?.emailConfigured ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">Email est configuré !</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <p><strong>Fournisseur:</strong> {debugInfo.emailProvider}</p>
                <p><strong>Email From:</strong> {debugInfo.emailFrom}</p>
                {debugInfo.resendConfigured && (
                  <p className="text-green-600"><strong>🔗 Resend API:</strong> Configuré</p>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-2xl">❌</span>
                <span className="font-semibold">Email n'est PAS configuré !</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-medium mb-2">Les emails ne peuvent pas être envoyés.</p>
                <p className="text-red-600 text-sm">Configurez RESEND_API_KEY sur votre serveur.</p>
              </div>
            </div>
          )}

          <button
            onClick={checkConfig}
            className="mt-4 text-[#5B7CFF] hover:underline text-sm"
          >
            🔄 Rafraîchir
          </button>
        </div>

        {/* Test Email */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Envoyer un email de test</h2>
          
          <div className="flex gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF]"
            />
            <button
              onClick={sendTestEmail}
              disabled={!testEmail || sending || !debugInfo?.emailConfigured}
              className="px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold rounded-xl disabled:opacity-50"
            >
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </div>

          {debugInfo?.emailResult && (
            <div className={`mt-4 p-4 rounded-xl ${debugInfo.emailResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              {debugInfo.emailResult.success ? (
                <div className="text-green-700">
                  <p className="font-semibold">✅ Email envoyé avec succès !</p>
                  <p className="text-sm">ID: {debugInfo.emailResult.messageId}</p>
                </div>
              ) : (
                <div className="text-red-700">
                  <p className="font-semibold">❌ Échec de l'envoi</p>
                  <p className="text-sm">{debugInfo.emailResult.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold text-green-900 mb-4">🚀 Comment configurer Resend (Recommandé)</h2>
          
          <div className="space-y-4 text-green-800">
            <p>Resend est gratuit (3,000 emails/mois) et fonctionne parfaitement sur Railway.</p>
            
            <div className="bg-white rounded-xl p-4 overflow-x-auto">
              <code className="text-sm text-gray-700">
                RESEND_API_KEY=re_xxxxxxxxxxxxx<br />
                SMTP_FROM={"Tikeo <onboarding@resend.dev>"}
              </code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-semibold text-yellow-800">⚠️ Important:</p>
              <p className="text-sm">Va sur <a href="https://resend.com" target="_blank" className="underline">resend.com</a>, récupère ta clé API (commence par re_) et configure la variable RESEND_API_KEY sur Railway.</p>
            </div>

            <p className="text-sm">Instructions:</p>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Va sur <a href="https://resend.com" target="_blank" className="underline">resend.com</a> et connecte-toi</li>
              <li>Va dans API Keys et copie ta clé (commence par re_)</li>
              <li>Va sur Railway, dans les variables d'environnement</li>
              <li>Ajoute: <code>RESEND_API_KEY=re_ta_cle_api</code></li>
              <li>Redéploie le projet!</li>
            </ol>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Dernière mise à jour: {debugInfo?.timestamp ? new Date(debugInfo.timestamp).toLocaleString('fr-FR') : '-'}
        </div>
      </div>
    </div>
  );
}

