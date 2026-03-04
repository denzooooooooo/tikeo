'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ProtectedRoute } from '../../../components/ProtectedRoute';
import { TicketSection } from './components/TicketSection';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

const CATEGORIES = [
  { name: 'Musique', emoji: '' }, { name: 'Sport', emoji: '' },
  { name: 'Conférence', emoji: '' }, { name: 'Festival', emoji: '' },
  { name: 'Théâtre', emoji: '' }, { name: 'Exposition', emoji: '' },
  { name: 'Gastronomie', emoji: '' }, { name: 'Famille', emoji: '' },
  { name: 'Networking', emoji: '' }, { name: 'Formation', emoji: '' },
  { name: 'Religion', emoji: '' }, { name: 'Autre', emoji: '' },
];

const COUNTRIES = [
  "Côte d'Ivoire", 'Sénégal', 'Nigeria', 'Gabon', 'Cameroun', 'Congo RDC',
  'Ghana', 'Afrique du Sud', 'Maroc', 'Mali', 'Bénin', 'Togo',
  'Burkina Faso', 'Niger', 'Guinée', 'France', 'Belgique', 'Canada', 'Autre',
];

const STEPS = ['Infos', 'Date & Lieu', 'Billets'];

interface TicketType { name: string; description: string; price: string; quantity: string; }

const inp = 'w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-base bg-white transition-all';
const inp_sm = 'w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white';

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#5B7CFF]' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-6' : ''}`} />
    </button>
  );
}

export default function CreateEventPage() {
  return <ProtectedRoute><CreateEventForm /></ProtectedRoute>;
}

function CreateEventForm() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const [f, setF] = useState({
    title: '', description: '', category: '', coverImage: '', teaserVideo: '',
    startDate: '', startTime: '18:00', endDate: '', endTime: '22:00',
    venueName: '', venueAddress: '', venueCity: '', venueCountry: "Côte d'Ivoire",
    currency: 'XOF',
    isOnline: false, isFree: false,
    tickets: [{ name: 'Standard', description: '', price: '0', quantity: '100' }] as TicketType[],
  });

  const set = (k: string, v: any) => setF(p => ({ ...p, [k]: v }));

  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { setError('Image uniquement (JPG, PNG, WebP)'); return; }
    if (file.size > 5 * 1024 * 1024) { setError('Max 5 Mo'); return; }
    setError(null);
    const reader = new FileReader();
    reader.onload = e => { const d = e.target?.result as string; setPreview(d); };
    reader.readAsDataURL(file);
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: fd });
      if (r.ok) {
        const { url } = await r.json();
        set('coverImage', url);
      } else {
        // Upload failed (Supabase not configured) — ask user for URL
        setImageMode('url');
        setError('Upload automatique indisponible. Collez une URL d\'image ci-dessous.');
      }
    } catch {
      setImageMode('url');
      setError('Upload indisponible. Collez une URL d\'image ci-dessous.');
    } finally { setUploading(false); }
  };

  const handleImageUrl = (url: string) => {
    setImageUrl(url);
    set('coverImage', url);
    if (url) setPreview(url);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0]; if (file) handleFile(file);
  }, []);

  const validate = () => {
    if (step === 0) {
      if (!f.title.trim()) { setError('Titre obligatoire'); return false; }
      if (!f.category) { setError('Choisissez une catégorie'); return false; }
      if (!f.description.trim()) { setError('Description obligatoire'); return false; }
    }
    if (step === 1) {
      if (!f.startDate) { setError('Date de début obligatoire'); return false; }
      if (!f.endDate) { setError('Date de fin obligatoire'); return false; }
      if (!f.isOnline && !f.venueCity.trim()) { setError('Ville obligatoire'); return false; }
    }
    if (step === 2) {
      if (!f.tickets.length) { setError('Ajoutez au moins un billet'); return false; }
      for (const t of f.tickets) {
        if (!t.name.trim()) { setError('Nom du billet obligatoire'); return false; }
        if (parseInt(t.quantity) <= 0) { setError('Quantité > 0'); return false; }
      }
    }
    setError(null); return true;
  };

  const submit = async () => {
    if (!validate()) return;
    // Block if image upload still in progress
    if (uploading) { setError('Veuillez attendre la fin de l\'upload de l\'image.'); return; }
    setLoading(true); setError(null);
    try {
      const stored = localStorage.getItem('auth_tokens');
      const token = stored ? JSON.parse(stored).accessToken : null;
      if (!token) { router.push('/(auth)/login?message=Connectez-vous pour créer un événement'); return; }

      const coverImageUrl = f.coverImage && !f.coverImage.startsWith('data:') ? f.coverImage : (imageUrl || undefined);

      const res = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: f.title, description: f.description, category: f.category,
          coverImage: coverImageUrl,
          teaserVideo: f.teaserVideo || undefined,
          startDate: new Date(`${f.startDate}T${f.startTime}:00`).toISOString(),
          endDate: new Date(`${f.endDate}T${f.endTime}:00`).toISOString(),
          venueName: f.isOnline ? 'En ligne' : f.venueName,
          venueAddress: f.isOnline ? '' : f.venueAddress,
          venueCity: f.isOnline ? 'En ligne' : f.venueCity,
          venueCountry: f.isOnline ? 'En ligne' : f.venueCountry,
          isOnline: f.isOnline, isFree: f.isFree,
          ticketTypes: f.tickets.map(t => ({
            name: t.name, description: t.description,
            price: f.isFree ? 0 : parseFloat(t.price) || 0,
            quantity: parseInt(t.quantity) || 0,
          })),
        }),
      });

      if (res.ok) { router.push('/dashboard/events?created=1'); return; }
      if (res.status === 401) {
        localStorage.removeItem('auth_tokens');
        router.push('/(auth)/login?message=Session expirée — reconnectez-vous');
        return;
      }
      const body = await res.json().catch(() => ({}));
      setError(Array.isArray(body.message) ? body.message.join(', ') : body.message || `Erreur ${res.status}`);
    } catch { setError('Impossible de contacter le serveur.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <Link href="/dashboard/events" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="font-bold text-gray-900 text-base sm:text-lg flex-1 truncate">Créer un événement</h1>
        <div className="flex items-center gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className="flex items-center gap-1">
              <button onClick={() => i < step && setStep(i)}
                className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                  i === step ? 'bg-[#5B7CFF] text-white scale-110' : i < step ? 'bg-green-500 text-white cursor-pointer' : 'bg-gray-200 text-gray-500'
                }`}>
                {i < step ? '' : i + 1}
              </button>
              {i < 2 && <div className={`w-3 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <p className="text-xs text-gray-500">Étape {step + 1}/3 — <span className="font-semibold text-gray-800">{STEPS[step]}</span></p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 pb-36">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
            <span className="text-red-500 flex-shrink-0"></span>
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 font-bold"></button>
          </div>
        )}

        {/* ÉTAPE 0 */}
        {step === 0 && (
          <div className="space-y-5">
            {/* Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Image de couverture</label>
              {/* Mode tabs */}
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => setImageMode('upload')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${imageMode === 'upload' ? 'bg-[#5B7CFF] text-white border-[#5B7CFF]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5B7CFF]'}`}>
                   Uploader un fichier
                </button>
                <button type="button" onClick={() => setImageMode('url')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${imageMode === 'url' ? 'bg-[#5B7CFF] text-white border-[#5B7CFF]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#5B7CFF]'}`}>
                   Coller une URL
                </button>
              </div>

              {imageMode === 'url' ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={e => handleImageUrl(e.target.value)}
                    placeholder="https://exemple.com/image.jpg"
                    className={inp}
                  />
                  {preview && imageMode === 'url' && (
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preview} alt="Aperçu" className="w-full h-full object-cover" onError={() => setPreview(null)} />
                    </div>
                  )}
                  <p className="text-xs text-gray-400">Collez l'URL directe d'une image (JPG, PNG, WebP)</p>
                </div>
              ) : (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    className={`relative rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                      dragging ? 'border-[#5B7CFF] bg-blue-50' : preview ? 'border-transparent shadow-md' : 'border-dashed border-gray-300 hover:border-[#5B7CFF]'
                    }`}
                  >
                    {preview ? (
                      <div className="relative aspect-video">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 active:opacity-100 transition-opacity">
                          <span className="text-white font-semibold text-sm bg-black/30 px-3 py-1.5 rounded-full"> Changer</span>
                        </div>
                        {uploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2">
                              <div className="w-4 h-4 border-2 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
                              <span className="text-sm font-medium">Upload…</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video flex flex-col items-center justify-center gap-3 p-6 bg-gray-50">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl"></div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-700 text-sm">Appuyer pour choisir depuis la galerie</p>
                          <p className="text-xs text-gray-400 mt-1">ou glisser une image · JPG, PNG, WebP · max 5 Mo</p>
                        </div>
                        {uploading && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-[#5B7CFF] border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-[#5B7CFF] font-medium">Upload…</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Titre */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Titre <span className="text-red-500">*</span></label>
              <input type="text" value={f.title} onChange={e => set('title', e.target.value)}
                placeholder="Ex: Concert Afrobeats 2025" className={inp} maxLength={100} />
              <p className="text-xs text-gray-400 mt-1 text-right">{f.title.length}/100</p>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Catégorie <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.name} type="button" onClick={() => set('category', cat.name)}
                    className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all active:scale-95 ${
                      f.category === cat.name ? 'border-[#5B7CFF] bg-[#5B7CFF]/10 text-[#5B7CFF]' : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                    }`}>
                    <span className="text-xl">{cat.emoji}</span>
                    <span className="text-xs font-medium leading-tight">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea value={f.description} onChange={e => set('description', e.target.value)}
                placeholder="Décrivez votre événement : programme, artistes, ambiance…"
                rows={5} className={`${inp} resize-none`} maxLength={2000} />
              <p className="text-xs text-gray-400 mt-1 text-right">{f.description.length}/2000</p>
            </div>

            {/* Teaser vidéo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                 Vidéo teaser <span className="text-xs font-normal text-gray-400 ml-1">(optionnel)</span>
              </label>
              <input
                type="url"
                value={f.teaserVideo}
                onChange={e => set('teaserVideo', e.target.value)}
                placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                className={inp}
              />
              <p className="text-xs text-gray-400 mt-1">Lien YouTube, Vimeo ou autre plateforme vidéo</p>
              {f.teaserVideo && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2">
                  <span className="text-green-600"></span>
                  <span className="text-xs text-green-700 font-medium truncate">{f.teaserVideo}</span>
                  <button type="button" onClick={() => set('teaserVideo', '')} className="ml-auto text-green-500 hover:text-red-500 font-bold text-sm flex-shrink-0"></button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-semibold text-gray-800 text-sm">Événement en ligne</p>
                <p className="text-xs text-gray-500 mt-0.5">Zoom, YouTube Live, etc.</p>
              </div>
              <Toggle on={f.isOnline} onToggle={() => set('isOnline', !f.isOnline)} />
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 text-sm"> Dates et horaires</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date début <span className="text-red-500">*</span></label>
                  <input type="date" value={f.startDate} min={new Date().toISOString().split('T')[0]}
                    onChange={e => { set('startDate', e.target.value); if (!f.endDate || f.endDate < e.target.value) set('endDate', e.target.value); }}
                    className={inp_sm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Heure début</label>
                  <input type="time" value={f.startTime} onChange={e => set('startTime', e.target.value)} className={inp_sm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Date fin <span className="text-red-500">*</span></label>
                  <input type="date" value={f.endDate} min={f.startDate || new Date().toISOString().split('T')[0]}
                    onChange={e => set('endDate', e.target.value)} className={inp_sm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Heure fin</label>
                  <input type="time" value={f.endTime} onChange={e => set('endTime', e.target.value)} className={inp_sm} />
                </div>
              </div>
            </div>

            {!f.isOnline && (
              <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 text-sm"> Lieu</h3>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nom du lieu</label>
                  <input type="text" value={f.venueName} onChange={e => set('venueName', e.target.value)}
                    placeholder="Ex: Palais de la Culture" className={inp_sm} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Adresse</label>
                  <input type="text" value={f.venueAddress} onChange={e => set('venueAddress', e.target.value)}
                    placeholder="Ex: Avenue Houphouët-Boigny" className={inp_sm} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Ville <span className="text-red-500">*</span></label>
                    <input type="text" value={f.venueCity} onChange={e => set('venueCity', e.target.value)}
                      placeholder="Ex: Abidjan" className={inp_sm} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Pays</label>
                    <select value={f.venueCountry} onChange={e => {
                      const country = e.target.value;
                      set('venueCountry', country);
                      // Auto-detect currency from country
                      const c = country.toLowerCase();
                      let currency = 'XOF';
                      if (c.includes('nigeria')) currency = 'NGN';
                      else if (c.includes('ghana')) currency = 'GHS';
                      else if (c.includes('kenya')) currency = 'KES';
                      else if (c.includes('afrique du sud') || c.includes('south africa')) currency = 'ZAR';
                      else if (c.includes('maroc') || c.includes('morocco')) currency = 'MAD';
                      else if (c.includes('tunisie') || c.includes('tunisia')) currency = 'TND';
                      else if (c.includes('algérie') || c.includes('algeria')) currency = 'DZD';
                      else if (c.includes('égypte') || c.includes('egypt')) currency = 'EGP';
                      else if (c.includes('cameroun') || c.includes('cameroon') || c.includes('gabon') || c.includes('congo')) currency = 'XAF';
                      else if (c.includes('france') || c.includes('belgique') || c.includes('allemagne') || c.includes('espagne') || c.includes('italie') || c.includes('portugal')) currency = 'EUR';
                      else if (c.includes('suisse') || c.includes('switzerland')) currency = 'CHF';
                      else if (c.includes('royaume-uni') || c.includes('united kingdom')) currency = 'GBP';
                      else if (c.includes('états-unis') || c.includes('united states')) currency = 'USD';
                      else if (c.includes('canada')) currency = 'CAD';
                      set('currency', currency);
                    }} className={inp_sm}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Sélecteur de devise */}
            <div className="p-4 bg-white rounded-xl border border-gray-200">
              <label className="block text-sm font-semibold text-gray-800 mb-2"> Devise des billets</label>
              <p className="text-xs text-gray-500 mb-3">Choisissez la devise dans laquelle vous vendez vos billets. Elle est automatiquement détectée selon le pays de l&apos;événement.</p>
              <select
                value={f.currency}
                onChange={e => set('currency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-800 focus:border-[#5B7CFF] outline-none bg-white"
              >
                <optgroup label="Afrique de l'Ouest (FCFA)">
                  <option value="XOF">XOF — Franc CFA (FCFA) — CI, SN, ML, BF, TG, BJ...</option>
                </optgroup>
                <optgroup label="Afrique Centrale (FCFA)">
                  <option value="XAF">XAF — Franc CFA — CM, GA, CG, TD...</option>
                </optgroup>
                <optgroup label="Autres devises africaines">
                  <option value="NGN">NGN — Naira nigérian (₦)</option>
                  <option value="GHS">GHS — Cedi ghanéen (GH₵)</option>
                  <option value="KES">KES — Shilling kényan (KSh)</option>
                  <option value="ZAR">ZAR — Rand sud-africain (R)</option>
                  <option value="MAD">MAD — Dirham marocain</option>
                  <option value="TND">TND — Dinar tunisien</option>
                  <option value="DZD">DZD — Dinar algérien</option>
                  <option value="EGP">EGP — Livre égyptienne</option>
                  <option value="ETB">ETB — Birr éthiopien</option>
                  <option value="GNF">GNF — Franc guinéen</option>
                </optgroup>
                <optgroup label="Europe">
                  <option value="EUR">EUR — Euro (€)</option>
                  <option value="CHF">CHF — Franc suisse</option>
                  <option value="GBP">GBP — Livre sterling (£)</option>
                </optgroup>
                <optgroup label="Amériques">
                  <option value="USD">USD — Dollar américain ($)</option>
                  <option value="CAD">CAD — Dollar canadien (CA$)</option>
                  <option value="BRL">BRL — Réal brésilien (R$)</option>
                </optgroup>
                <optgroup label="Autres">
                  <option value="AED">AED — Dirham des EAU</option>
                  <option value="JPY">JPY — Yen japonais (¥)</option>
                  <option value="INR">INR — Roupie indienne (₹)</option>
                </optgroup>
              </select>
              <p className="text-xs text-[#5B7CFF] mt-2 font-medium">
                Devise sélectionnée : <strong>{f.currency}</strong> — Pays : {f.venueCountry}
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200">
              <div>
                <p className="font-semibold text-gray-800 text-sm">Événement gratuit</p>
                <p className="text-xs text-gray-500 mt-0.5">Entrée libre, sans paiement</p>
              </div>
              <Toggle on={f.isFree} onToggle={() => set('isFree', !f.isFree)} />
            </div>
            <TicketSection
              tickets={f.tickets}
              isFree={f.isFree}
              onUpdate={(i, field, val) => {
                const updated = [...f.tickets];
                updated[i] = { ...updated[i], [field]: val };
                set('tickets', updated);
              }}
              onAdd={() => set('tickets', [...f.tickets, { name: '', description: '', price: '0', quantity: '50' }])}
              onRemove={i => set('tickets', f.tickets.filter((_, idx) => idx !== i))}
            />
          </div>
        )}
      </div>

      {/* Navigation sticky en bas */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-4 py-3 safe-area-pb">
        <div className="max-w-2xl mx-auto flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              ← Retour
            </button>
          )}
          {step < 2 ? (
            <button onClick={() => { if (validate()) setStep(s => s + 1); }}
              className="flex-1 py-3.5 rounded-xl bg-[#5B7CFF] text-white font-semibold hover:bg-[#4a6be8] active:scale-[0.98] transition-all shadow-md">
              Suivant →
            </button>
          ) : (
            <button onClick={submit} disabled={loading}
              className="flex-1 py-3.5 rounded-xl bg-[#5B7CFF] text-white font-semibold hover:bg-[#4a6be8] active:scale-[0.98] transition-all shadow-md disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Création…
                </>
              ) : ' Créer l\'événement'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
