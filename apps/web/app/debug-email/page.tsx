'use client';

import { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

interface HealthData {
  status?: string;
  emailConfigured?: boolean;
  emailProvider?: string;
  emailFrom?: string;
  resendConfigured?: boolean;
  smtpHost?: string;
  smtpPort?: string | number;
  smtpFrom?: string;
  timestamp?: string;
  [key: string]: unknown;
}

interface TestResult {
  success: boolean;
  messageId?: string;
  error?: string;
  [key: string]: unknown;
}

interface DiagStep {
  label: string;
  status: 'ok' | 'error' | 'warn' | 'pending';
  detail: string;
}

export default function DebugEmailPage() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [testRaw, setTestRaw] = useState<string>('');
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [diagSteps, setDiagSteps] = useState<DiagStep[]>([]);

  const buildDiagSteps = (data: HealthData | null, reachable: boolean, error: string): DiagStep[] => {
    const steps: DiagStep[] = [];

    // Step 1: API reachable
    steps.push({
      label: '1. API Railway accessible',
      status: reachable ? 'ok' : 'error',
      detail: reachable
        ? `✅ API répond sur ${API_URL}`
        : `❌ Impossible de joindre l'API: ${error || 'Erreur réseau'}`,
    });

    if (!reachable || !data) return steps;

    // Step 2: API status
    steps.push({
      label: '2. Statut de l\'API',
      status: data.status === 'ok' ? 'ok' : 'error',
      detail: data.status === 'ok'
        ? '✅ API fonctionne normalement'
        : `❌ API en erreur: status = ${data.status}`,
    });

    // Step 3: Email service configured
    const emailConfigured = data.emailConfigured || data.resendConfigured;
    steps.push({
      label: '3. Service email configuré',
      status: emailConfigured ? 'ok' : 'error',
      detail: emailConfigured
        ? `✅ Service email actif (provider: ${data.emailProvider || 'resend'})`
        : '❌ AUCUN service email configuré — RESEND_API_KEY manquant sur Railway!',
    });

    // Step 4: Resend API key
    steps.push({
      label: '4. Clé API Resend (RESEND_API_KEY)',
      status: data.resendConfigured ? 'ok' : 'error',
      detail: data.resendConfigured
        ? '✅ RESEND_API_KEY est configurée sur Railway'
        : '❌ RESEND_API_KEY n\'est PAS configurée → Va sur Railway > Variables > Ajouter RESEND_API_KEY=re_xxxxx',
    });

    // Step 5: From email
    steps.push({
      label: '5. Adresse email expéditeur (SMTP_FROM)',
      status: data.emailFrom ? 'ok' : 'warn',
      detail: data.emailFrom
        ? `✅ From: ${data.emailFrom}`
        : '⚠️ SMTP_FROM non configuré — utilise onboarding@resend.dev par défaut',
    });

    // Step 6: Provider
    if (data.emailProvider && data.emailProvider !== 'none') {
      steps.push({
        label: '6. Fournisseur email actif',
        status: data.emailProvider === 'resend' ? 'ok' : 'warn',
        detail: data.emailProvider === 'resend'
          ? '✅ Utilise Resend API (recommandé)'
          : `⚠️ Utilise ${data.emailProvider} — considère passer à Resend`,
      });
    } else {
      steps.push({
        label: '6. Fournisseur email actif',
        status: 'error',
        detail: '❌ Aucun fournisseur actif — emails ne peuvent pas être envoyés',
      });
    }

    return steps;
  };

  const checkConfig = async () => {
    setLoading(true);
    setApiError('');
    setTestResult(null);
    setTestRaw('');

    try {
      const res = await fetch(`${API_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      setHttpStatus(res.status);
      const text = await res.text();
      setRawResponse(text);

      let data: HealthData = {};
      try {
        data = JSON.parse(text);
      } catch {
        setApiError(`Réponse non-JSON reçue (HTTP ${res.status}): ${text.substring(0, 200)}`);
        setApiReachable(false);
        setDiagSteps(buildDiagSteps(null, false, `HTTP ${res.status}`));
        setLoading(false);
        return;
      }

      setHealthData(data);
      setApiReachable(true);
      setDiagSteps(buildDiagSteps(data, true, ''));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setApiError(msg);
      setApiReachable(false);
      setRawResponse('');
      setDiagSteps(buildDiagSteps(null, false, msg));
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    if (!testEmail) return;
    setSending(true);
    setTestResult(null);
    setTestRaw('');

    try {
      const res = await fetch(`${API_URL}/health/test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });

      const text = await res.text();
      setTestRaw(text);

      let data: TestResult = { success: false };
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: false, error: `Réponse non-JSON (HTTP ${res.status}): ${text.substring(0, 300)}` };
      }

      setTestResult(data);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTestResult({ success: false, error: msg });
      setTestRaw(msg);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    checkConfig();
  }, []);

  const statusColor = (s: DiagStep['status']) => {
    if (s === 'ok') return 'bg-green-50 border-green-200 text-green-800';
    if (s === 'error') return 'bg-red-50 border-red-200 text-red-800';
    if (s === 'warn') return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    return 'bg-gray-50 border-gray-200 text-gray-600';
  };

  const statusIcon = (s: DiagStep['status']) => {
    if (s === 'ok') return '✅';
    if (s === 'error') return '❌';
    if (s === 'warn') return '⚠️';
    return '⏳';
  };

  const overallOk = diagSteps.length > 0 && diagSteps.every((s) => s.status === 'ok' || s.status === 'warn');

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">🔧 Debug Email Complet</h1>
            <p className="text-gray-500 text-sm mt-1">Diagnostic complet du service email Tikeo</p>
          </div>
          <button
            onClick={checkConfig}
            disabled={loading}
            className="px-4 py-2 bg-[#5B7CFF] text-white rounded-xl font-semibold text-sm disabled:opacity-50 hover:bg-[#4a6be8] transition"
          >
            {loading ? '⏳ Chargement...' : '🔄 Rafraîchir'}
          </button>
        </div>

        {/* API URL Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
          <strong>🌐 API URL utilisée:</strong> <code className="bg-blue-100 px-2 py-0.5 rounded">{API_URL}</code>
          {httpStatus && (
            <span className={`ml-3 px-2 py-0.5 rounded font-bold ${httpStatus === 200 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              HTTP {httpStatus}
            </span>
          )}
        </div>

        {/* Diagnostic Steps */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            🩺 Diagnostic pas-à-pas
            {!loading && diagSteps.length > 0 && (
              <span className={`ml-3 text-sm font-normal px-3 py-1 rounded-full ${overallOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {overallOk ? '✅ Tout OK' : '❌ Problème détecté'}
              </span>
            )}
          </h2>

          {loading ? (
            <div className="flex items-center gap-3 text-gray-500 py-4">
              <div className="w-6 h-6 border-2 border-gray-300 border-t-[#5B7CFF] rounded-full animate-spin" />
              Analyse en cours...
            </div>
          ) : diagSteps.length === 0 ? (
            <p className="text-gray-400">Cliquez sur Rafraîchir pour lancer le diagnostic.</p>
          ) : (
            <div className="space-y-3">
              {diagSteps.map((step, i) => (
                <div key={i} className={`border rounded-xl p-4 ${statusColor(step.status)}`}>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{statusIcon(step.status)}</span>
                    <div>
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-sm mt-0.5 opacity-90">{step.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-300 rounded-2xl p-5">
            <h3 className="font-bold text-red-800 mb-2">🚨 Erreur de connexion à l'API</h3>
            <pre className="text-red-700 text-sm whitespace-pre-wrap break-all bg-red-100 rounded-lg p-3">{apiError}</pre>
            <p className="text-red-600 text-sm mt-3">
              → Vérifie que ton api-gateway est bien déployé sur Railway et que l'URL est correcte.
            </p>
          </div>
        )}

        {/* Raw Health Response */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-3">📋 Réponse brute de /health</h2>
          {rawResponse ? (
            <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-64">
              {(() => {
                try {
                  return JSON.stringify(JSON.parse(rawResponse), null, 2);
                } catch {
                  return rawResponse;
                }
              })()}
            </pre>
          ) : (
            <p className="text-gray-400 text-sm">Aucune réponse reçue.</p>
          )}
        </div>

        {/* Test Email */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🧪 Envoyer un email de test</h2>

          <div className="flex gap-3">
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendTestEmail()}
              placeholder="votre@email.com"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5B7CFF]/30 focus:border-[#5B7CFF] text-sm"
            />
            <button
              onClick={sendTestEmail}
              disabled={!testEmail || sending}
              className="px-6 py-3 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-bold rounded-xl disabled:opacity-50 hover:opacity-90 transition text-sm"
            >
              {sending ? '⏳ Envoi...' : '📨 Envoyer'}
            </button>
          </div>

          {!healthData?.emailConfigured && !healthData?.resendConfigured && healthData && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-yellow-800 text-sm">
              ⚠️ Le service email n'est pas configuré — l'envoi va échouer. Configure d'abord RESEND_API_KEY.
            </div>
          )}

          {/* Test Result */}
          {testResult && (
            <div className={`mt-4 rounded-xl border p-4 ${testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-bold text-lg ${testResult.success ? 'text-green-700' : 'text-red-700'}`}>
                {testResult.success ? '✅ Email envoyé avec succès!' : '❌ Échec de l\'envoi'}
              </p>
              {testResult.success && testResult.messageId && (
                <p className="text-green-600 text-sm mt-1">Message ID: <code className="bg-green-100 px-1 rounded">{testResult.messageId}</code></p>
              )}
              {!testResult.success && testResult.error && (
                <div className="mt-2">
                  <p className="text-red-600 text-sm font-semibold">Erreur:</p>
                  <pre className="text-red-700 text-xs bg-red-100 rounded-lg p-3 mt-1 whitespace-pre-wrap break-all">{testResult.error}</pre>
                </div>
              )}
            </div>
          )}

          {/* Raw test response */}
          {testRaw && (
            <div className="mt-4">
              <p className="text-gray-500 text-xs font-semibold mb-1">Réponse brute de /health/test-email:</p>
              <pre className="bg-gray-900 text-green-400 rounded-xl p-3 text-xs overflow-x-auto whitespace-pre-wrap break-all max-h-40">
                {(() => {
                  try {
                    return JSON.stringify(JSON.parse(testRaw), null, 2);
                  } catch {
                    return testRaw;
                  }
                })()}
              </pre>
            </div>
          )}
        </div>

        {/* Fix Instructions */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🛠️ Comment corriger le problème</h2>

          <div className="space-y-4">
            {/* Most likely fix */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <p className="font-bold text-orange-800 mb-2">🎯 Cause la plus probable: RESEND_API_KEY manquante</p>
              <ol className="list-decimal list-inside text-orange-700 text-sm space-y-2">
                <li>Va sur <a href="https://resend.com/api-keys" target="_blank" className="underline font-semibold">resend.com/api-keys</a></li>
                <li>Copie ta clé API (commence par <code className="bg-orange-100 px-1 rounded">re_</code>)</li>
                <li>Va sur <strong>Railway</strong> → ton service <strong>api-gateway</strong> → <strong>Variables</strong></li>
                <li>Ajoute: <code className="bg-orange-100 px-2 py-0.5 rounded font-mono">RESEND_API_KEY=re_ta_cle_ici</code></li>
              <li>Ajoute aussi: <code className="bg-orange-100 px-2 py-0.5 rounded font-mono">{'SMTP_FROM=Tikeo <onboarding@resend.dev>'}</code></li>
                <li><strong>Redéploie</strong> le service (Railway le fait automatiquement)</li>
                <li>Reviens ici et clique <strong>Rafraîchir</strong></li>
              </ol>
            </div>

            {/* Variables needed */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2 text-sm">📋 Variables Railway nécessaires:</p>
              <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 space-y-1">
                <p>RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx</p>
                <p>{'SMTP_FROM=Tikeo <onboarding@resend.dev>'}</p>
              </div>
            </div>

            {/* Note about Resend free tier */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-blue-800 text-sm">
              <p className="font-semibold">ℹ️ Resend gratuit = 3,000 emails/mois</p>
              <p className="mt-1">Avec le domaine <code>@resend.dev</code>, aucune configuration DNS n'est nécessaire. Les emails partent immédiatement.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-xs pb-6">
          Dernière vérification: {healthData?.timestamp ? new Date(healthData.timestamp as string).toLocaleString('fr-FR') : loading ? 'En cours...' : 'Jamais'}
          {' · '}
          <button onClick={checkConfig} className="underline hover:text-gray-600">Rafraîchir</button>
        </div>
      </div>
    </div>
  );
}
