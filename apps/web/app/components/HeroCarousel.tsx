'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const ChevronLeftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
);
const ChevronRightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
);
const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
);
const VolumeMuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
);
const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
);
const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" /></svg>
);
const TicketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /></svg>
);

interface FeaturedEvent {
  id: string;
  title: string;
  coverImage: string;
  teaserVideo?: string;
  startDate: string;
  venueCity: string;
  venueCountry: string;
  category: string;
  price: number;
  description?: string;
}

interface HeroCarouselProps {
  events: FeaturedEvent[];
}

// Phase: 'image' → show cover for 2s, 'teaser' → play video full-screen max 20s, then next
type Phase = 'image' | 'teaser';

const IMAGE_DURATION = 2000;   // 2 seconds
const TEASER_MAX_DURATION = 20000; // 20 seconds

export default function HeroCarousel({ events }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('image');
  const [isMuted, setIsMuted] = useState(true);
  const [teaserProgress, setTeaserProgress] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentEvent = events[currentIndex];

  const clearTimers = useCallback(() => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  }, []);

  const goToNext = useCallback(() => {
    clearTimers();
    if (videoRef.current) videoRef.current.pause();
    setPhase('image');
    setTeaserProgress(0);
    setCurrentIndex((prev) => (prev + 1) % events.length);
  }, [events.length, clearTimers]);

  const goToPrev = useCallback(() => {
    clearTimers();
    if (videoRef.current) videoRef.current.pause();
    setPhase('image');
    setTeaserProgress(0);
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  }, [events.length, clearTimers]);

  const goToIndex = useCallback((idx: number) => {
    clearTimers();
    if (videoRef.current) videoRef.current.pause();
    setPhase('image');
    setTeaserProgress(0);
    setCurrentIndex(idx);
  }, [clearTimers]);

  // Phase machine: image → teaser → next
  useEffect(() => {
    if (!isAutoPlay || events.length === 0) return;
    clearTimers();

    if (phase === 'image') {
      // Show image for 2 seconds, then go to teaser (if video exists) or next slide
      phaseTimerRef.current = setTimeout(() => {
        if (currentEvent?.teaserVideo) {
          setPhase('teaser');
          setTeaserProgress(0);
        } else {
          goToNext();
        }
      }, IMAGE_DURATION);
    } else if (phase === 'teaser') {
      // Play video, advance after 20s max
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }

      // Progress bar
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const pct = Math.min((elapsed / TEASER_MAX_DURATION) * 100, 100);
        setTeaserProgress(pct);
        if (pct >= 100) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        }
      }, 100);

      // Max 20 seconds then next
      phaseTimerRef.current = setTimeout(() => {
        goToNext();
      }, TEASER_MAX_DURATION);
    }

    return () => clearTimers();
  }, [currentIndex, phase, isAutoPlay, events.length, currentEvent, goToNext, clearTimers]);

  // Pause video when phase changes away from teaser
  useEffect(() => {
    if (phase !== 'teaser' && videoRef.current) {
      videoRef.current.pause();
    }
  }, [phase]);

  if (!currentEvent || events.length === 0) {
    return (
      <div
        className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5B7CFF 0%, #7B61FF 50%, #9D4EDD 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
        />
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full filter blur-3xl" />
        <div className="relative text-white text-center px-4 max-w-2xl mx-auto">
          <div className="text-7xl mb-6">{'🎉'}</div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">Bienvenue sur Tikeo</h2>
          <p className="text-white/80 text-lg sm:text-xl mb-4 leading-relaxed">
            La plateforme de billetterie africaine.
          </p>
          <p className="text-white/70 text-base sm:text-lg mb-10">
            Découvrez les meilleurs événements près de chez vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#5B7CFF] rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl"
            >
              Explorer les événements
            </a>
            <a
              href="/dashboard/events/create"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-white/50 text-white rounded-xl font-bold hover:bg-white/10 transition-all"
            >
              Créer un événement
            </a>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const eventDate = formatDate(currentEvent.startDate);

  return (
    <div className="relative h-[85vh] min-h-[600px] overflow-hidden bg-gray-900">

      {/* ── PHASE IMAGE ── Cover photo */}
      <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 'image' ? 'opacity-100' : 'opacity-0'}`}>
        <Image
          src={currentEvent.coverImage || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&q=80`}
          alt={currentEvent.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-transparent" />
      </div>

      {/* ── PHASE TEASER ── Full-screen video */}
      {currentEvent.teaserVideo && (
        <div className={`absolute inset-0 transition-opacity duration-700 ${phase === 'teaser' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <video
            ref={videoRef}
            src={currentEvent.teaserVideo}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            loop={false}
            onEnded={goToNext}
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-transparent to-transparent" />

          {/* TEASER badge + progress bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              TEASER — {currentEvent.title}
            </div>
            {/* Progress bar */}
            <div className="w-64 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-100" style={{ width: `${teaserProgress}%` }} />
            </div>
          </div>

          {/* Mute / Skip controls */}
          <div className="absolute top-6 right-6 flex items-center gap-2 z-20">
            <button
              onClick={() => {
                const newMuted = !isMuted;
                setIsMuted(newMuted);
                if (videoRef.current) videoRef.current.muted = newMuted;
              }}
              className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full text-white hover:bg-black/60 transition-all"
            >
              {isMuted ? <VolumeMuteIcon /> : <VolumeIcon />}
            </button>
            <button
              onClick={goToNext}
              className="px-4 py-2 bg-black/40 backdrop-blur-sm rounded-full text-white text-xs font-semibold hover:bg-black/60 transition-all"
            >
              Passer →
            </button>
          </div>
        </div>
      )}

      {/* Decorative blobs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#5B7CFF] rounded-full mix-blend-multiply filter blur-[100px] opacity-20 animate-blob pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#7B61FF] rounded-full mix-blend-multiply filter blur-[100px] opacity-15 animate-blob animation-delay-2000 pointer-events-none" />

      {/* ── CONTENT OVERLAY (always visible) ── */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 flex items-end z-10">
        <div className="w-full lg:w-2/3 xl:w-1/2">
          {/* Category */}
          <div className="mb-5 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full text-white/90 text-sm font-semibold">
              <TicketIcon />
              {currentEvent.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-5 leading-tight animate-fade-in-up animation-delay-100">
            {currentEvent.title}
          </h1>

          {/* Description */}
          {currentEvent.description && (
            <p className="text-lg text-white/75 mb-7 max-w-xl line-clamp-2 animate-fade-in-up animation-delay-200">
              {currentEvent.description}
            </p>
          )}

          {/* Date + Location */}
          <div className="flex flex-wrap gap-3 mb-7 animate-fade-in-up animation-delay-300">
            <div className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <div className="text-center min-w-[44px]">
                <div className="text-2xl font-bold text-white leading-none">{eventDate.day}</div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider">{eventDate.month}</div>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <div className="text-xs text-white/60">{eventDate.year}</div>
                <div className="text-white font-semibold text-sm">{eventDate.time}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              <MapPinIcon />
              <div>
                <div className="text-white font-semibold text-sm">{currentEvent.venueCity}</div>
                <div className="text-xs text-white/60">{currentEvent.venueCountry}</div>
              </div>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up animation-delay-400">
            <div className="px-5 py-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl">
              {currentEvent.price === 0 ? (
                <span className="text-2xl font-bold text-green-400">Gratuit</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-white">{currentEvent.price.toLocaleString()} FCFA</span>
                  <span className="text-white/60 text-xs ml-1">à partir de</span>
                </>
              )}
            </div>
            <Link
              href={`/events/${currentEvent.id}`}
              className="flex items-center gap-2 px-7 py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition-all hover:scale-105 text-sm"
            >
              Voir l&apos;événement
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            </Link>
            {currentEvent.teaserVideo && phase === 'image' && (
              <button
                onClick={() => { clearTimers(); setPhase('teaser'); setTeaserProgress(0); }}
                className="flex items-center gap-2 px-5 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all text-sm"
              >
                <PlayIcon />
                Voir le teaser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── NAVIGATION ARROWS ── */}
      <button onClick={goToPrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 hover:scale-110 transition-all z-20">
        <ChevronLeftIcon />
      </button>
      <button onClick={goToNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 hover:scale-110 transition-all z-20">
        <ChevronRightIcon />
      </button>

      {/* ── DOTS + AUTOPLAY ── */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {events.map((_, i) => (
          <button
            key={i}
            onClick={() => goToIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/35 hover:bg-white/60'}`}
          />
        ))}
      </div>

      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="absolute bottom-7 right-6 w-9 h-9 flex items-center justify-center bg-black/30 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-black/50 transition-all z-20"
        title={isAutoPlay ? 'Pause' : 'Play'}
      >
        {isAutoPlay ? <PauseIcon /> : <PlayIcon />}
      </button>

      {/* Phase indicator (small dot) */}
      <div className="absolute bottom-7 left-6 flex items-center gap-1.5 z-20">
        <div className={`w-2 h-2 rounded-full transition-all ${phase === 'image' ? 'bg-white' : 'bg-[#5B7CFF]'}`} />
        <span className="text-white/50 text-[10px] font-medium">{phase === 'image' ? 'Photo' : 'Teaser'}</span>
      </div>
    </div>
  );
}
