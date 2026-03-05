'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api-gateway-production-8ee0.up.railway.app/api/v1';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try { const s = localStorage.getItem('auth_tokens'); return s ? JSON.parse(s).accessToken : null; } catch { return null; }
}

export interface ScanResult {
  valid: boolean; message: string; scannedAt?: string;
  ticket?: { id: string; qrCode: string; status: string; event?: { title: string; startDate: string; venueName: string; venueCity: string }; user?: { firstName: string; lastName: string; email: string }; ticketType?: { name: string } };
}
export interface ScanEntry { qr: string; result: ScanResult; time: Date }
export interface Toast { id: number; type: 'warn'|'err'|'ok'|'info'; title: string; msg: string }

declare class BarcodeDetector {
  constructor(o?: { formats: string[] });
  detect(img: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}

export function beep(ok: boolean) {
  try {
    const ctx = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.value = ok ? 880 : 220; o.type = ok ? 'sine' : 'square';
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.3);
  } catch {}
}
export function vib(p: number | number[]) { try { navigator.vibrate?.(p); } catch {} }

export function fmtMsg(m: string, at?: string): string {
  if (m === 'Ticket validated successfully') return 'Billet valide avec succes';
  if (m === 'Ticket already scanned') return `Deja scanne le ${at ? new Date(at).toLocaleString('fr-FR') : ''}`;
  if (m === 'Ticket not found') return 'Billet introuvable';
  if (m.startsWith('Ticket is')) return `Statut: ${m.replace('Ticket is ', '').toUpperCase()}`;
  if (m.startsWith('Unauthorized')) return m.replace('Unauthorized: ', '');
  return m;
}

export function exportCSV(h: ScanEntry[]) {
  const rows = [['Heure','Code QR','Statut','Titulaire','Evenement','Type'],
    ...h.map(e => [e.time.toLocaleString('fr-FR'), e.qr, e.result.valid?'VALIDE':'INVALIDE',
      e.result.ticket?.user ? `${e.result.ticket.user.firstName} ${e.result.ticket.user.lastName}` : '',
      e.result.ticket?.event?.title||'', e.result.ticket?.ticketType?.name||''])];
  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = `scans-${new Date().toISOString().slice(0,10)}.csv`; a.click();
}

export function useScannerLogic() {
  const [mode, setMode] = useState<'camera'|'manual'>('camera');
  const [qrInput, setQrInput] = useState('');
  const [result, setResult] = useState<ScanResult|null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ScanEntry[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sseOk, setSseOk] = useState(false);
  const [camActive, setCamActive] = useState(false);
  const [camErr, setCamErr] = useState<string|null>(null);
  const [hasDetector, setHasDetector] = useState(false);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [camLastDetected, setCamLastDetected] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream|null>(null);
  const rafRef = useRef<number|null>(null);
  const detRef = useRef<BarcodeDetector|null>(null);
  const sseRef = useRef<AbortController|null>(null);
  const tidRef = useRef(0);

  useEffect(() => { setHasDetector(typeof window !== 'undefined' && 'BarcodeDetector' in window); }, []);

  const toast = useCallback((t: Omit<Toast,'id'>) => {
    const id = ++tidRef.current;
    setToasts(p => [...p, { ...t, id }]);
    setTimeout(() => setToasts(p => p.filter(x => x.id !== id)), 6000);
  }, []);

  const rmToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), []);

  const connectSSE = useCallback(async (token: string, uid: string) => {
    sseRef.current?.abort();
    const ctrl = new AbortController(); sseRef.current = ctrl;
    try {
      const res = await fetch(`${API_URL}/tickets/scan-events`, { headers: { Authorization: `Bearer ${token}` }, signal: ctrl.signal });
      if (!res.ok || !res.body) { setSseOk(false); return; }
      setSseOk(true);
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = '';
      while (true) {
        const { done, value } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() || '';
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const ev = JSON.parse(line.slice(6));
              if (ev.type === 'ALREADY_SCANNED' && ev.scannedByUserId !== uid) {
                toast({ type: 'warn', title: 'Tentative de fraude detectee', msg: `${ev.userName||'Inconnu'} — ${ev.eventTitle||''} — Deja scanne le ${ev.scannedAt ? new Date(ev.scannedAt).toLocaleString('fr-FR') : '?'}` });
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

  useEffect(() => {
    const token = getToken(); if (!token) return;
    fetch(`${API_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d?.id) connectSSE(token, d.id); }).catch(() => {});
    return () => { sseRef.current?.abort(); };
  }, [connectSSE]);

  const stopCam = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCamActive(false); setLastCode(null);
  }, []);

  const startCam = useCallback(async () => {
    setCamErr(null);
    setCameraStarting(true);
    if (!hasDetector) {
      setCamErr('BarcodeDetector non supporte. Utilisez Chrome 83+, Edge 83+ ou Safari 17+.');
      setCameraStarting(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      detRef.current = new BarcodeDetector({ formats: ['qr_code'] });
      setCamActive(true);
    } catch (e: any) {
      if (e?.name === 'NotAllowedError') setCamErr("Permission camera refusee. Autorisez l'acces dans les parametres.");
      else if (e?.name === 'NotFoundError') setCamErr('Aucune camera detectee.');
      else setCamErr('Impossible d\'acceder a la camera: ' + (e?.message || 'erreur inconnue'));
    } finally {
      setCameraStarting(false);
    }
  }, [hasDetector]);

  const doScan = useCallback(async (qrCode?: string) => {
    const code = qrCode || qrInput.trim(); if (!code) return;
    const token = getToken();
    if (!token) { toast({ type: 'err', title: 'Non connecte', msg: 'Veuillez vous connecter.' }); return; }
    setLoading(true); setResult(null);
    try {
      const res = await fetch(`${API_URL}/tickets/validate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ qrCode: code }),
      });
      const data: ScanResult = await res.json();
      setResult(data);
      setHistory(p => [{ qr: code, result: data, time: new Date() }, ...p.slice(0, 49)]);
      setQrInput('');
      if (data.valid) { beep(true); vib(100); }
      else {
        beep(false); vib([100,50,100,50,100]);
        if (data.message === 'Ticket already scanned') toast({ type: 'warn', title: 'Billet deja utilise', msg: `Scanne le ${data.scannedAt ? new Date(data.scannedAt).toLocaleString('fr-FR') : '?'}` });
      }
    } catch { setResult({ valid: false, message: 'Erreur de connexion au serveur' }); beep(false); }
    finally { setLoading(false); }
  }, [qrInput, toast]);

  useEffect(() => {
    if (!camActive || !detRef.current || !videoRef.current) return;
    let alive = true;
    const scan = async () => {
      if (!alive || !videoRef.current || !detRef.current) return;
      if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA && !cooldown) {
        try {
          const codes = await detRef.current.detect(videoRef.current);
          if (codes.length > 0) {
            const c = (codes[0].rawValue || '').trim();
            if (c) setCamLastDetected(c);
            if (c && c !== lastCode) {
              setLastCode(c);
              setCooldown(true);
              doScan(c);
              setTimeout(() => setCooldown(false), 1800);
            }
          }
        } catch {}
      }
      if (alive) rafRef.current = requestAnimationFrame(scan);
    };
    rafRef.current = requestAnimationFrame(scan);
    return () => { alive = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [camActive, cooldown, lastCode, doScan]);

  useEffect(() => {
    if (mode === 'camera') startCam(); else stopCam();
    return () => stopCam();
  }, [mode]); // eslint-disable-line

  useEffect(() => () => { stopCam(); sseRef.current?.abort(); }, []); // eslint-disable-line

  const stats = {
    total: history.length,
    valid: history.filter(s => s.result.valid).length,
    invalid: history.filter(s => !s.result.valid).length,
    rate: history.length > 0 ? Math.round(history.filter(s => s.result.valid).length / history.length * 100) : 0,
  };

  return {
    mode, setMode, qrInput, setQrInput, result, loading,
    history, setHistory, toasts, rmToast, sseOk,
    camActive, camErr, cameraStarting, camLastDetected,
    videoRef, startCam, stopCam, doScan, stats,
  };
}
