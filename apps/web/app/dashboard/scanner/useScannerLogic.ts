'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { const s = localStorage.getItem('auth_tokens'); return s ? JSON.parse(s).accessToken : null; } catch { return null; }
}

export interface ScanResult {
  valid: boolean; 
  message: string; 
  scannedAt?: string;
  ticket?: { 
    id: string; 
    qrCode: string; 
    status: string; 
    event?: { title: string; startDate: string; venueName: string; venueCity: string }; 
    user?: { firstName: string; lastName: string; email: string }; 
    ticketType?: { name: string } 
  };
}
export interface ScanEntry { qr: string; result: ScanResult; time: Date }
export interface Toast { id: number; type: 'warn'|'err'|'ok'|'info'; title: string; msg: string }

// Types pour html5-qrcode
interface Html5QrcodeScanner {
  start(
    elementId: string, 
    config: { fps: number; qrbox: { width: number; height: number }; aspectRatio: number },
    onScanSuccess: (decodedText: string) => void,
    onScanFailure: (error: string) => void
  ): Promise<void>;
  stop(): Promise<void>;
  clear(): void;
}

declare global {
  interface Window {
    Html5QrcodeScanner: new (elementId: string, config: { fps: number; qrbox: { width: number; height: number }; aspectRatio: number }, verbose?: boolean) => Html5QrcodeScanner;
  }
}

// Fonction beep pour signaler le résultat
export function beep(ok: boolean) {
  try {
    const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220;
    o.type = ok ? 'sine' : 'square';
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.3);
  } catch {}
}

// Fonction vibration
export function vib(p: number | number[]) { try { navigator.vibrate?.(p); } catch {} }

// Formatage des messages
export function fmtMsg(m: string, at?: string): string {
  if (m === 'Ticket validated successfully') return 'Billet valide avec succes';
  if (m === 'Ticket already scanned') return `Deja scanne le ${at ? new Date(at).toLocaleString('fr-FR') : ''}`;
  if (m === 'Ticket not found') return 'Billet introuvable';
  if (m.startsWith('Ticket is')) return `Statut: ${m.replace('Ticket is ', '').toUpperCase()}`;
  if (m.startsWith('Unauthorized')) return m.replace('Unauthorized: ', '');
  return m;
}

// Export CSV
export function exportCSV(h: ScanEntry[]) {
  const rows = [['Heure','Code QR','Statut','Titulaire','Evenement','Type'],
    ...h.map(e => [e.time.toLocaleString('fr-FR'), e.qr, e.result.valid?'VALIDE':'INVALIDE',
      e.result.ticket?.user ? `${e.result.ticket.user.firstName} ${e.result.ticket.user.lastName}` : '',
      e.result.ticket?.event?.title||'', e.result.ticket?.ticketType?.name||''])];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `scans-${new Date().toISOString().slice(0,10)}.csv`; 
  a.click();
}

export function useScannerLogic() {
  const [mode, setMode] = useState<'camera'|'manual'>('camera');
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<ScanResult|null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sseOk, setSseOk] = useState(false);
  
  // États pour la caméra
  const [camActive, setCamActive] = useState(false);
  const [camErr, setCamErr] = useState<string|null>(null);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [camLastDetected, setCamLastDetected] = useState<string | null>(null);
  
  // États pour éviter les doublons
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);

  // Refs - utiliser un conteneur div pour html5-qrcode
  const scannerContainerRef = useRef<HTMLDivElement | null>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const sseRef = useRef<AbortController | null>(null);
  const tidRef = useRef(0);

  // Toast helper
  const toast = useCallback((t: Omit<Toast,'id'>) => {
    const id = ++tidRef.current;
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 6000);
  }, []);

  const rmToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);

  // Connexion SSE pour alertes temps réel
  const connectSSE = useCallback(async (token: string, uid: string) => {
    sseRef.current?.abort();
    const ctrl = new AbortController(); 
    sseRef.current = ctrl;
    try {
      const res = await fetch(`${API_URL}/tickets/scan-events`, { 
        headers: { Authorization: `Bearer ${token}` }, 
        signal: ctrl.signal 
      });
      if (!res.ok || !res.body) { setSseOk(false); return; }
      setSseOk(true);
      const reader = res.body.getReader(); 
      const dec = new TextDecoder(); 
      let buf = '';
      while (true) {
        const { done, value } = await reader.read(); 
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); 
        buf = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const ev = JSON.parse(line.slice(6));
              if (ev.type === 'ALREADY_SCANNED' && ev.scannedByUserId !== uid) {
                toast({ type: 'warn', title: 'Tentative de fraude detectee', msg: `${ev.userName||'Inconnu'} — ${ev.eventTitle||''} — Deja scanne` });
                vib([100,50,100]);
              }
            } catch {}
          }
        }
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setSseOk(false);
        setTimeout(() => { const t = getToken(); if (t && uid) connectSSE(t, uid); }, 5000);
      }
    }
  }, [toast]);

  // Initialisation SSE
  useEffect(() => {
    const token = getToken(); 
    if (!token) return;
    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d?.id) connectSSE(token, d.id); })
      .catch(() => {});
    return () => { sseRef.current?.abort(); };
  }, [connectSSE]);

  // Fonction de scan HTTP vers l'API
  const doScan = useCallback(async (qrCode?: string) => {
    const code = qrCode || qrInput.trim(); 
    if (!code) return;
    const token = getToken();
    if (!token) { 
      toast({ type: 'err', title: 'Non connecte', msg: 'Veuillez vous connecter.' }); 
      return; 
    }
    setLoading(true); 
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/tickets/validate`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ qrCode: code }),
      });
      const data: ScanResult = await res.json();
      setResult(data);
      setHistory(p => [{ qr: code, result: data, time: new Date() }, ...p.slice(0, 49)]);
      setQrInput('');
      if (data.valid) { 
        beep(true); 
        vib(100); 
        toast({ type: 'ok', title: 'Billet valide', msg: 'Acces autorise' });
      } else {
        beep(false); 
        vib([100,50,100,50,100]);
        if (data.message === 'Ticket already scanned') {
          toast({ type: 'warn', title: 'Billet deja utilise', msg: `Scanne le ${data.scannedAt ? new Date(data.scannedAt).toLocaleString('fr-FR') : '?'}` });
        } else {
          toast({ type: 'err', title: 'Billet invalide', msg: data.message });
        }
      }
    } catch { 
      setResult({ valid: false, message: 'Erreur de connexion au serveur' }); 
      beep(false); 
    }
    finally { setLoading(false); }
  }, [qrInput, toast]);

  // Arrêter le scanner
  const stopCam = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (e) {
        // Ignorer les erreurs lors de l'arrêt
      }
      scannerRef.current = null;
    }
    setCamActive(false);
    setLastCode(null);
  }, []);

  // Démarrer la caméra avec html5-qrcode
  const startCam = useCallback(async () => {
    setCamErr(null);
    setCameraStarting(true);
    
    try {
      // Vérifier si le navigateur supporte getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCamErr('Camera non supportee sur ce navigateur. Utilisez le mode Manuel.');
        setCameraStarting(false);
        return;
      }

      // Vérifier si https (requis pour camera)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setCamErr('Camera necessite HTTPS. Utilisez le mode Manuel.');
        setCameraStarting(false);
        return;
      }

      // Utiliser le conteneur existant pour html5-qrcode
      const containerId = 'qr-video-container';
      let videoElement = document.getElementById(containerId);
      if (!videoElement) {
        videoElement = document.createElement('div');
        videoElement.id = containerId;
        videoElement.style.cssText = 'width: 100%; height: 100%; position: absolute; top: 0; left: 0;';
        if (scannerContainerRef.current) {
          scannerContainerRef.current.appendChild(videoElement);
        }
      }

      // Import dynamique de html5-qrcode
      const { Html5Qrcode } = await import('html5-qrcode');
      
      const html5QrCode = new Html5Qrcode(containerId);
      scannerRef.current = html5QrCode as unknown as Html5QrcodeScanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      await html5QrCode.start(
        { facingMode: 'environment' },
        config,
        (decodedText: string) => {
          // QR code détecté
          const code = decodedText.trim();
          if (code && code !== lastCode) {
            setLastCode(code);
            setCamLastDetected(code);
            // Cooldown pour éviter les doublons
            if (!cooldown) {
              setCooldown(true);
              doScan(code);
              setTimeout(() => setCooldown(false), 2000);
            }
          }
        },
        () => {
          // Erreur de scan (normal, ignoré)
        }
      );

      setCamActive(true);
      setCameraStarting(false);
      
    } catch (e: any) {
      console.error('Camera error:', e);
      if (e?.name === 'NotAllowedError') {
        setCamErr("Permission camera refusee. Autorisez l'acces dans les parametres.");
      } else if (e?.name === 'NotFoundError') {
        setCamErr('Aucune camera detectee.');
      } else {
        setCamErr('Impossible de demarrer la camera: ' + (e?.message || 'erreur inconnue'));
      }
      setCameraStarting(false);
    }
  }, [lastCode, cooldown, doScan]);

  // Gestion du changement de mode
  useEffect(() => {
    if (mode === 'camera') { 
      void startCam(); 
    } else { 
      void stopCam(); 
    }
    return () => { void stopCam(); };
  }, [mode, startCam, stopCam]);

  // Nettoyage au unmount
  useEffect(() => () => { stopCam(); sseRef.current?.abort(); }, []);

  // Statistiques
  const stats = {
    total: history.length,
    valid: history.filter(s => s.result.valid).length,
    invalid: history.filter(s => !s.result.valid).length,
    rate: history.length > 0 ? Math.round(history.filter(s => s.result.valid).length / history.length * 100) : 0,
  };

  return {
    mode, 
    setMode, 
    qrInput, 
    setQrInput, 
    result, 
    loading,
    history, 
    setHistory, 
    toasts, 
    rmToast, 
    sseOk,
    camActive, 
    camErr, 
    cameraStarting, 
    camLastDetected,
    scannerContainerRef, 
    startCam, 
    stopCam, 
    doScan, 
    stats,
  };
}

