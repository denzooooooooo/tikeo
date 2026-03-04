'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('auth_tokens');
    return stored ? JSON.parse(stored).accessToken : null;
  } catch { return null; }
}

interface ScanResult {
  valid: boolean;
  message: string;
  scannedAt?: string;
  ticket?: {
    id: string;
    qrCode: string;
    status: string;
    event?: { title: string; startDate: string; venueName: string };
    user?: { firstName: string; lastName: string; email: string };
    ticketType?: { name: string };
  };
}

export default function ScannerPage() {
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [scanHistory, setScanHistory] = useState<Array<{ qr: string; result: ScanResult; time: Date }>>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Check if user is organizer
      fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.json())
        .then(data => {
          if (data.role === 'ORGANIZER' || data.role === 'ADMIN') {
            setIsOrganizer(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleScan = async (qrCode?: string) => {
    const code = qrCode || qrInput.trim();
    if (!code) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/tickets/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrCode: code }),
      });

      const data: ScanResult = await res.json();
      setResult(data);
      setScanHistory(prev => [{ qr: code, result: data, time: new Date() }, ...prev.slice(0, 9)]);
      setQrInput('');
    } catch (err) {
      setResult({ valid: false, message: 'Erreur de connexion au serveur' });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleScan();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white"> Scanner de billets</h1>
              <p className="text-white/80 text-sm mt-1">Validez les billets à l'entrée de l'événement</p>
            </div>
            <Link href="/dashboard" className="text-white/80 hover:text-white text-sm underline">
              ← Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Scanner Input */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Saisir le code QR</h2>

            {/* Manual input */}
            <div className="space-y-3">
              <input
                type="text"
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="TKT-1234567890-abc123"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl font-mono text-sm focus:outline-none focus:border-[#5B7CFF] transition-colors"
                autoFocus
              />
              <button
                onClick={() => handleScan()}
                disabled={loading || !qrInput.trim()}
                className="w-full py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Validation...
                  </span>
                ) : ' Valider le billet'}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700">
              <strong> Astuce :</strong> Connectez un scanner QR USB — il saisit automatiquement le code et appuie sur Entrée.
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className={`rounded-2xl p-6 border-2 ${
              result.valid
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                  result.valid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {result.valid ? '' : ''}
                </div>
                <div>
                  <p className={`font-bold text-lg ${result.valid ? 'text-green-800' : 'text-red-800'}`}>
                    {result.valid ? 'BILLET VALIDE' : 'BILLET INVALIDE'}
                  </p>
                  <p className={`text-sm ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
                    {result.message === 'Ticket validated successfully' ? 'Billet validé avec succès' :
                     result.message === 'Ticket already scanned' ? `Déjà scanné le ${result.scannedAt ? new Date(result.scannedAt).toLocaleString('fr-FR') : ''}` :
                     result.message === 'Ticket not found' ? 'Billet introuvable' :
                     result.message}
                  </p>
                </div>
              </div>

              {result.valid && result.ticket && (
                <div className="space-y-2 text-sm border-t border-green-200 pt-3 mt-3">
                  {result.ticket.user && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Titulaire</span>
                      <span className="font-semibold text-gray-900">
                        {result.ticket.user.firstName} {result.ticket.user.lastName}
                      </span>
                    </div>
                  )}
                  {result.ticket.event && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Événement</span>
                      <span className="font-semibold text-gray-900 text-right max-w-[60%]">
                        {result.ticket.event.title}
                      </span>
                    </div>
                  )}
                  {result.ticket.ticketType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-semibold text-gray-900">{result.ticket.ticketType.name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Code</span>
                    <span className="font-mono text-xs text-gray-700">{result.ticket.qrCode}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Scan History */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Historique des scans
            {scanHistory.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">({scanHistory.length})</span>
            )}
          </h2>

          {scanHistory.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3"></div>
              <p className="text-sm">Aucun scan effectué</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {scanHistory.map((entry, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border ${
                    entry.result.valid
                      ? 'bg-green-50 border-green-100'
                      : 'bg-red-50 border-red-100'
                  }`}
                >
                  <span className="text-lg">{entry.result.valid ? '' : ''}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-gray-700 truncate">{entry.qr}</p>
                    {entry.result.ticket?.user && (
                      <p className="text-xs text-gray-500">
                        {entry.result.ticket.user.firstName} {entry.result.ticket.user.lastName}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {entry.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {scanHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-gray-500">
                 {scanHistory.filter(s => s.result.valid).length} valides
              </span>
              <span className="text-gray-500">
                 {scanHistory.filter(s => !s.result.valid).length} invalides
              </span>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-4"> Comment ça fonctionne</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="text-2xl">1⃣</span>
              <div>
                <p className="font-semibold text-gray-800">Achat du billet</p>
                <p>L'acheteur reçoit un code unique <code className="bg-gray-100 px-1 rounded text-xs">TKT-xxx</code> dans son compte et par email.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2⃣</span>
              <div>
                <p className="font-semibold text-gray-800">À l'entrée</p>
                <p>L'organisateur scanne le QR code affiché sur le téléphone du participant.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3⃣</span>
              <div>
                <p className="font-semibold text-gray-800">Validation</p>
                <p> Vert = billet valide, entrée accordée.  Rouge = déjà utilisé ou invalide.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
