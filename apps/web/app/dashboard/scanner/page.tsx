'use client';
import Link from 'next/link';
import { useScannerLogic, exportCSV, fmtMsg, Toast, ScanEntry } from './useScannerLogic';

function Toasts({ list, rm }: { list: Toast[]; rm: (id: number) => void }) {
  if (!list.length) return null;
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none">
      {list.map(t => (
        <div key={t.id} className={`flex gap-3 p-4 rounded-xl shadow-2xl border text-sm pointer-events-auto ${
          t.type==='warn' ? 'bg-orange-950 border-orange-500/40 text-orange-200' :
          t.type==='err'  ? 'bg-red-950 border-red-500/40 text-red-200' :
          t.type==='ok'   ? 'bg-green-950 border-green-500/40 text-green-200' :
                            'bg-blue-950 border-blue-500/40 text-blue-200'}`}>
          <span className="text-xl flex-shrink-0">{t.type==='warn'?'⚠️':t.type==='err'?'🚨':t.type==='ok'?'✅':'ℹ️'}</span>
          <div className="flex-1 min-w-0">
            <p className="font-bold">{t.title}</p>
            <p className="text-xs opacity-80 mt-0.5">{t.msg}</p>
          </div>
          <button onClick={() => rm(t.id)} className="opacity-50 hover:opacity-100 text-lg leading-none flex-shrink-0">×</button>
        </div>
      ))}
    </div>
  );
}

function HistoryRow({ e }: { e: ScanEntry }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 border-b border-gray-800 last:border-0 ${e.result.valid ? 'hover:bg-green-500/5' : 'hover:bg-red-500/5'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold ${e.result.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {e.result.valid ? '✓' : '✗'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-mono text-xs text-gray-400 truncate">{e.qr}</p>
        {e.result.ticket?.user && (
          <>
            <p className="text-xs text-gray-300 font-medium truncate">
              {e.result.ticket.user.firstName} {e.result.ticket.user.lastName}
            </p>
            {e.result.ticket.user.email && (
              <p className="text-xs text-gray-500 truncate">{e.result.ticket.user.email}</p>
            )}
            {e.result.ticket.user.phone && (
              <p className="text-xs text-gray-600 truncate">{e.result.ticket.user.phone}</p>
            )}
          </>
        )}
        {e.result.ticket?.event && (
          <p className="text-xs text-gray-500 truncate">{e.result.ticket.event.title}</p>
        )}
        {!e.result.valid && (
          <p className="text-xs text-red-400 truncate">{fmtMsg(e.result.message, e.result.scannedAt)}</p>
        )}
      </div>
      <span className="text-xs text-gray-600 whitespace-nowrap flex-shrink-0">
        {e.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
}

export default function ScannerPage() {
  const {
    mode, setMode, qrInput, setQrInput, result, loading,
    history, setHistory, toasts, rmToast, sseOk,
    camActive, camErr, cameraStarting, camLastDetected, scannerContainerRef, startCam, stopCam, doScan, stats,
  } = useScannerLogic();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toasts list={toasts} rm={rmToast} />

      <style>{`@keyframes scanLine{0%,100%{top:8%}50%{top:88%}}`}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] px-4 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">📷</div>
            <div>
              <h1 className="text-lg font-bold text-white">Scanner de billets</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`w-2 h-2 rounded-full ${sseOk ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                <span className="text-white/70 text-xs">{sseOk ? 'Alertes temps reel actives' : 'Alertes deconnectees'}</span>
              </div>
            </div>
          </div>
          <Link href="/dashboard" className="text-white/70 hover:text-white text-sm underline">← Dashboard</Link>
        </div>
      </div>

      {/* Stats bar */}
      {stats.total > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3 grid grid-cols-4 gap-3">
            {[
              { label: 'Total', value: String(stats.total), color: 'text-white' },
              { label: 'Valides', value: String(stats.valid), color: 'text-green-400' },
              { label: 'Invalides', value: String(stats.invalid), color: 'text-red-400' },
              { label: 'Taux', value: `${stats.rate}%`, color: stats.rate >= 80 ? 'text-green-400' : 'text-yellow-400' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                <div className="text-gray-500 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Scanner ── */}
        <div className="space-y-4">

          {/* Mode toggle */}
          <div className="flex bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
            {(['camera','manual'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${mode===m ? 'bg-[#5B7CFF] text-white shadow-lg' : 'text-gray-500 hover:text-gray-900'}`}>
                {m === 'camera' ? '📷 Camera' : '⌨️ Manuel / USB'}
              </button>
            ))}
          </div>

          {/* Camera mode */}
          {mode === 'camera' && (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {camErr ? (
                <div className="p-8 text-center">
                  <div className="text-5xl mb-4">📵</div>
                  <p className="text-red-400 text-sm font-semibold mb-2">Camera indisponible</p>
                  <p className="text-gray-500 text-xs mb-5 leading-relaxed">{camErr}</p>
                  <button onClick={startCam} className="px-5 py-2.5 bg-[#5B7CFF] text-white rounded-xl text-sm font-semibold hover:bg-[#4B6CFF] transition-colors">
                    Reessayer
                  </button>
                  <p className="text-gray-600 text-xs mt-3">Ou passez en mode <strong className="text-gray-400">Manuel / USB</strong></p>
                </div>
              ) : (
                <div className="relative bg-black aspect-square" ref={scannerContainerRef}>
                  {camActive && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="relative w-56 h-56 z-10">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#5B7CFF] rounded-tl-lg" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#5B7CFF] rounded-tr-lg" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#5B7CFF] rounded-bl-lg" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#5B7CFF] rounded-br-lg" />
                        <div className="absolute left-2 right-2 h-0.5 bg-[#5B7CFF]"
                          style={{ boxShadow: '0 0 8px #5B7CFF', animation: 'scanLine 2s ease-in-out infinite' }} />
                      </div>
                      <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                        <span className="bg-black/70 text-white text-xs px-4 py-2 rounded-full">
                          {loading ? '⏳ Validation...' : '🔍 Pointez vers un QR code'}
                        </span>
                      </div>
                    </div>
                  )}
                  {!camActive && !camErr && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black">
                      <div className="text-center">
                        <div className="w-8 h-8 border-2 border-[#5B7CFF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">{cameraStarting ? 'Demarrage de la camera...' : 'Camera inactive'}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="p-3 flex items-center justify-between border-t border-gray-200">
                <div className="space-y-0.5">
                  <span className="text-xs text-gray-500 block">{camActive ? '🟢 Camera active — scan auto' : '⚫ Camera inactive'}</span>
                  {camLastDetected && (
                    <span className="text-[10px] text-gray-600 block truncate max-w-[180px]">Dernier QR: {camLastDetected}</span>
                  )}
                </div>
                <button onClick={camActive ? stopCam : startCam}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${camActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-[#5B7CFF]/20 text-[#5B7CFF] hover:bg-[#5B7CFF]/30'}`}>
                  {camActive ? '⏹ Arreter' : cameraStarting ? '⏳ Demarrage' : '▶ Demarrer'}
                </button>
              </div>
            </div>
          )}

          {/* Manual mode */}
          {mode === 'manual' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-3 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700">Saisir le code QR</h2>
              <input
                type="text" value={qrInput} onChange={e => setQrInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doScan()}
                placeholder="TKT-1234567890-abc123"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl font-mono text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#5B7CFF] transition-colors"
                autoFocus
              />
              <button onClick={() => doScan()} disabled={loading || !qrInput.trim()}
                className="w-full py-3 bg-[#5B7CFF] text-white rounded-xl font-semibold hover:bg-[#4B6CFF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                    Validation...
                  </span>
                ) : '✓ Valider le billet'}
              </button>
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-400">
                <strong>💡 Scanner USB :</strong> Connectez un scanner QR USB — il saisit automatiquement le code et appuie sur Entree.
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className={`rounded-2xl p-5 border-2 ${result.valid ? 'bg-green-500/10 border-green-500/40' : 'bg-red-500/10 border-red-500/40'}`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${result.valid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {result.valid ? '✅' : '❌'}
                </div>
                <div>
                  <p className={`font-bold text-lg ${result.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {result.valid ? 'BILLET VALIDE' : 'BILLET INVALIDE'}
                  </p>
                  <p className={`text-sm ${result.valid ? 'text-green-300' : 'text-red-300'}`}>
                    {fmtMsg(result.message, result.scannedAt)}
                  </p>
                </div>
              </div>
              {result.ticket && (
              <div className="space-y-1.5 text-sm border-t border-white/10 pt-3 mt-3">
                  {result.ticket.user && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Titulaire</span>
                        <span className="font-semibold">{result.ticket.user.firstName} {result.ticket.user.lastName}</span>
                      </div>
                      {result.ticket.user.email && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email</span>
                          <span className="font-semibold text-right max-w-[60%] break-all">{result.ticket.user.email}</span>
                        </div>
                      )}
                      {result.ticket.user.phone && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Téléphone</span>
                          <span className="font-semibold">{result.ticket.user.phone}</span>
                        </div>
                      )}
                      {result.ticket.user.buyerType && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type acheteur</span>
                          <span className="font-semibold uppercase">{result.ticket.user.buyerType}</span>
                        </div>
                      )}
                    </>
                  )}
                  {result.ticket.event && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Evenement</span>
                      <span className="font-semibold text-right max-w-[60%]">{result.ticket.event.title}</span>
                    </div>
                  )}
                  {result.ticket.ticketType && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type</span>
                      <span className="font-semibold">{result.ticket.ticketType.name}</span>
                    </div>
                  )}
                  {result.ticket.event && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Lieu</span>
                      <span className="font-semibold text-right max-w-[60%]">{result.ticket.event.venueName}, {result.ticket.event.venueCity}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Code</span>
                    <span className="font-mono text-xs text-gray-400">{result.ticket.qrCode}</span>
                  </div>
                </div>
              )}

              {!result.valid && result.ticket?.user && (
                <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs font-semibold text-gray-300 mb-2">Fallback contrôle manuel</p>
                  <p className="text-xs text-gray-400">
                    Si le QR ne passe pas, vérifiez l’identité acheteur:
                  </p>
                  <p className="text-xs text-gray-200 mt-1">
                    {result.ticket.user.firstName} {result.ticket.user.lastName}
                    {result.ticket.user.email ? ` • ${result.ticket.user.email}` : ''}
                    {result.ticket.user.phone ? ` • ${result.ticket.user.phone}` : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Right: History ── */}
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col min-h-[400px] shadow-sm">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="font-bold text-gray-800">
              Historique
              {history.length > 0 && <span className="ml-2 text-sm font-normal text-gray-500">({history.length})</span>}
            </h2>
            {history.length > 0 && (
              <div className="flex gap-2">
                <button onClick={() => exportCSV(history)}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold transition-colors">
                  ⬇ CSV
                </button>
                <button onClick={() => setHistory([])}
                  className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs font-semibold transition-colors">
                  🗑 Vider
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-gray-500">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm">Aucun scan effectue</p>
                <p className="text-xs mt-1 text-gray-700">Les scans apparaitront ici en temps reel</p>
              </div>
            ) : (
              <div>
                {history.map((e, i) => <HistoryRow key={i} e={e} />)}
              </div>
            )}
          </div>

          {history.length > 0 && (
            <div className="p-3 border-t border-gray-200 flex justify-between text-xs text-gray-500 flex-shrink-0">
              <span className="text-green-400">✓ {stats.valid} valides</span>
              <span className="text-red-400">✗ {stats.invalid} invalides</span>
            </div>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Comment ca fonctionne</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-semibold text-gray-800">Achat du billet</p>
                <p>L&apos;acheteur recoit un code unique <code className="bg-gray-100 px-1 rounded text-xs text-gray-700">TKT-xxx</code> dans son compte et par email.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-semibold text-gray-800">A l&apos;entree</p>
                <p>Scannez le QR code via la camera ou saisissez le code manuellement / via scanner USB.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-semibold text-gray-800">Validation instantanee</p>
                <p>✅ Vert = valide, entree accordee. ❌ Rouge = deja utilise ou invalide. Alertes fraude en temps reel.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
