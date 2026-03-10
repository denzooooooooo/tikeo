'use client';

import { LikeButton, ReviewForm } from '@tikeo/ui';
import ShareButton from './ShareButton';

interface Props {
  eventId: string;
  title?: string;
  image?: string;
  initialLiked?: boolean;
  initialCount?: number;
  reviewOnly?: boolean;
}

export default function EventInteractiveActions({
  eventId,
  title,
  image,
  initialLiked = false,
  initialCount = 0,
  reviewOnly = false,
}: Props) {
  if (reviewOnly) {
    return <ReviewForm eventId={eventId} />;
  }

  return (
    <div className="absolute top-4 right-4 flex gap-2">
      <LikeButton
        eventId={eventId}
        initialLiked={initialLiked}
        initialCount={initialCount}
      />
      <ShareButton title={title || 'Événement'} eventId={eventId} image={image} />
    </div>
  );
}
