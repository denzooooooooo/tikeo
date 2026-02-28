'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CalendarIcon, LocationIcon, PlayIcon, HeartIcon } from '@tikeo/ui';

interface EventCardProps {
  id: string;
  title: string;
  coverImage: string;
  videoUrl?: string;
  category: string;
  venueName: string;
  venueCity: string;
  startDate: string;
  minPrice: number;
  currency?: string;
  isFeatured?: boolean;
}

export function EventCard({
  id,
  title,
  coverImage,
  videoUrl,
  category,
  venueName,
  venueCity,
  startDate,
  minPrice,
  currency = 'EUR',
  isFeatured = false,
}: EventCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current && videoUrl) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current && videoUrl) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase(),
      day: date.getDate(),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  // Currency code → display symbol
  const CURRENCY_SYMBOLS: Record<string, string> = {
    XOF: 'FCFA', XAF: 'FCFA', NGN: '₦', GHS: 'GH₵',
    ZAR: 'R', MAD: 'MAD', GNF: 'GNF', CDF: 'FC',
    EUR: '€', USD: '$', CAD: 'CAD', CHF: 'CHF',
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuit';
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
    const formatted = new Intl.NumberFormat('fr-FR').format(price);
    const suffixCurrencies = ['XOF', 'XAF', 'MAD', 'GNF', 'CDF', 'CAD', 'CHF'];
    if (suffixCurrencies.includes(currency)) return `${formatted} ${symbol}`;
    return `${symbol}${formatted}`;
  };

  const dateInfo = formatDate(startDate);

  return (
    <Link
      href={`/events/${id}`}
      className="group cursor-pointer block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-[4/3] mb-4">
        {/* Gradient Overlay - Always visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10 pointer-events-none"></div>

        {/* Video Background - Shows on hover if available */}
        {videoUrl && isHovered ? (
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}

        {/* Play Button Overlay when video exists */}
        {videoUrl && (
          <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <PlayIcon size={32} className="text-white ml-1" />
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="px-3 py-1 bg-white/95 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-900">
            {category}
          </span>
        </div>

        {/* Favorite Button */}
        <button
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <HeartIcon size={20} className="text-gray-700" />
        </button>

        {/* Date Badge */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-white rounded-lg p-2 text-center shadow-lg">
            <div className="text-xs font-semibold text-gray-500 uppercase">
              {dateInfo.month}
            </div>
            <div className="text-2xl font-bold text-gray-900">{dateInfo.day}</div>
          </div>
        </div>

        {/* Video Indicator */}
        {videoUrl && (
          <div className="absolute bottom-4 right-4 z-20">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs text-white font-medium">
              <PlayIcon size={12} className="text-white" />
              <span>Teaser</span>
            </div>
          </div>
        )}
      </div>

      {/* Event Info */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors line-clamp-1">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <LocationIcon size={16} className="text-gray-400 flex-shrink-0" />
          <span className="line-clamp-1">{venueName}, {venueCity}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon size={16} className="text-gray-400" />
            <span className="text-sm text-gray-600">
              {dateInfo.day} {dateInfo.month} - {dateInfo.time}
            </span>
          </div>
          <div className="text-lg font-bold text-[#5B7CFF]">
          {minPrice === 0 ? (
              <span>Gratuit</span>
            ) : (
              <span>dès {formatPrice(minPrice)}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// Featured Event Card with larger format
export function FeaturedEventCard(props: EventCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-100 aspect-[21/9] group">
      <Link href={`/events/${props.id}`} className="block">
        {/* Video/Image Background */}
        {props.videoUrl ? (
          <video
            src={props.videoUrl}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Image
            src={props.coverImage}
            alt={props.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

        {/* Play Button */}
        {props.videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlayIcon size={40} className="text-white ml-1" />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="absolute inset-0 flex items-center p-8 lg:p-12">
          <div className="max-w-xl">
            <span className="inline-block px-3 py-1 bg-[#5B7CFF] text-white text-xs font-semibold rounded-full mb-4">
              {props.isFeatured ? 'En vedette' : props.category}
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 line-clamp-2">
              {props.title}
            </h2>
            <div className="flex items-center gap-4 text-white/90 mb-6">
              <div className="flex items-center gap-2">
                <CalendarIcon size={20} />
                <span>
                  {new Date(props.startDate).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LocationIcon size={20} />
                <span>{props.venueName}, {props.venueCity}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-white">
              {props.minPrice === 0
                  ? 'Gratuit'
                  : (() => {
                      const sym: Record<string, string> = { XOF: 'FCFA', XAF: 'FCFA', NGN: '₦', GHS: 'GH₵', ZAR: 'R', MAD: 'MAD', GNF: 'GNF', CDF: 'FC', EUR: '€', USD: '$', CAD: 'CAD' };
                      const c = props.currency || 'XOF';
                      const s = sym[c] ?? c;
                      const f = new Intl.NumberFormat('fr-FR').format(props.minPrice);
                      const suffix = ['XOF','XAF','MAD','GNF','CDF','CAD'].includes(c);
                      return `dès ${suffix ? `${f} ${s}` : `${s}${f}`}`;
                    })()}
              </span>
              <span className="px-6 py-3 bg-white text-[#5B7CFF] font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                Reservez
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

