'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface DebugInfo {
  smtpConfigured: boolean;
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
        smtpConfigured: data.smtpConfigured || false,
        smtpHost: data.smtpHost,
        smtpPort: data.smtpPort?.toString(),
        smtpFrom: data.smtpFrom,
        timestamp: new Date().toISOString(),
      });
    } catch (e) {
      setDebugInfo({
        smtpConfigured: false,
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">📧 Configuration SMTP</h2>
          
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#5B7CFF] rounded-full animate-spin" />
              Chargement...
            </div>
          ) : debugInfo?.smtpConfigured ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-2xl">✅</span>
                <span className="font-semibold">SMTP est configuré !</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
                <p><strong>Hôte:</strong> {debugInfo.smtpHost}</p>
                <p><strong>Port:</strong> {debugInfo.smtpPort}</p>
                <p><strong>Email From:</strong> {debugInfo.smtpFrom}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600">
                <span className="text-2xl">❌</span>
                <span className="font-semibold">SMTP n'est PAS configuré !</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-700 font-medium mb-2">Les emails ne peuvent pas être envoyés.</p>
                <p className="text-red-600 text-sm">Configurez les variables SMTP sur votre serveur.</p>
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
              disabled={!testEmail || sending || !debugInfo?.smtpConfigured}
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
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">📝 Comment configurer SMTP</h2>
          
          <div className="space-y-4 text-blue-800">
            <p>Ajoutez ces variables d'environnement sur votre serveur (Railway, VPS, etc.):</p>
            
            <div className="bg-white rounded-xl p-4 overflow-x-auto">
              <code className="text-sm text-gray-700">
                SMTP_HOST=smtp.gmail.com<br/>
                SMTP_PORT=587<br/>
                SMTP_USER=djedjedange4@gmail.com<br/>
                SMTP_PASS=pqdipngwfnkkouou<br/>
                SMTP_FROM=Tikeo {"<"}no-reply@tikeo.co{">"}
              </code>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="font-semibold text-yellow-800">⚠️ Problème avec Gmail sur Railway:</p>
              <p className="text-sm">Gmail bloque souvent les connexions depuis des serveurs cloud. Solutions:</p>
              <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                <li>1. Utilise un mot de passe d'application (déjà fait)</li>
                <li>2. Ou utilise <strong>Resend.com</strong> (gratuit, plus fiable)</li>
                <li>3. Ajoute aussi: <code>SMTP_FORCE_IPV4=true</code></li>
              </ul>
            </div>

            <p className="text-sm">Autres fournisseurs SMTP populaires:</p>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li><strong>SendGrid:</strong> smtp.sendgrid.net (port 587)</li>
              <li><strong>Mailgun:</strong> smtp.mailgun.org (port 587)</li>
              <li><strong>Resend:</strong> smtp.resend.com (port 587)</li>
              <li><strong>Brevo:</strong> smtp-relay.brevo.com (port 587)</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Dernière mise à jour: {debugInfo?.timestamp ? new Date(debugInfo.timestamp).toLocaleString('fr-FR') : '-'}
        </div>
      </div>
    </div>
  );
}

