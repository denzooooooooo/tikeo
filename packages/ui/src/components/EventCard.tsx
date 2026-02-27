import * as React from 'react';
import Link from 'next/link';
import { cn, formatDate, formatTime, formatCurrency } from '../lib/utils';
import { Card, CardContent } from './Card';
import { LikeButton } from './LikeButton';

interface EventCardProps {
  id: string;
  title: string;
  description?: string;
  image: string;
  date: Date | string;
  location: string;
  price: number;
  category?: string;
  attendees?: number;
  isFeatured?: boolean;
  likes?: number;
  isLiked?: boolean;
  showLikeButton?: boolean;
  className?: string;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  image,
  date,
  location,
  price,
  category,
  attendees,
  isFeatured = false,
  likes = 0,
  isLiked = false,
  showLikeButton = false,
  className,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        'group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-premium hover:-translate-y-1',
        isFeatured && 'ring-2 ring-primary shadow-premium',
        className
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] overflow-hidden bg-background-secondary">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Category Badge */}
        {category && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-text-primary shadow-md">
              {category}
            </span>
          </div>
        )}

        {/* Featured Badge */}
        {isFeatured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center rounded-full bg-gradient-to-r from-accent-gradient-from to-accent-gradient-to px-3 py-1 text-xs font-semibold text-white shadow-lg">
              ⭐ À la une
            </span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <CardContent className="p-5">
        {/* Title */}
        <h3 className="mb-2 text-heading-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        {description && (
          <p className="mb-4 text-body-md text-text-secondary line-clamp-2">
            {description}
          </p>
        )}

        {/* Date & Location */}
        <div className="mb-4 space-y-2">
          <div className="flex items-center text-body-md text-text-secondary">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">
              {formatDate(date, 'long')} • {formatTime(date)}
            </span>
          </div>

          <div className="flex items-center text-body-md text-text-secondary">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{location}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          {/* Price */}
          <div>
            <span className="text-display-sm font-bold text-primary">
              {formatCurrency(price)}
            </span>
          </div>

          {/* Like Button & Attendees */}
          <div className="flex items-center gap-3">
            {showLikeButton && (
              <LikeButton
                eventId={id}
                initialLiked={isLiked}
                initialCount={likes}
                size="sm"
              />
            )}
            {attendees !== undefined && (
              <div className="flex items-center text-body-sm text-text-secondary">
                <svg
                  className="mr-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{attendees}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

EventCard.displayName = 'EventCard';
