'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { TrophyIcon, ShareButton, LoadingSpinner, ErrorAlert } from '@tikeo/ui';

interface ContestantImage {
  id: string;
  contestantId: string;
  contestantName: string;
  contestantImage: string;
  url: string;
  caption?: string;
  likes: number;
  isWinner?: boolean;
}

interface Contest {
  id: string;
  title: string;
  status: string;
}

// Mock data
const mockContest: Contest = {
  id: '1',
  title: 'Meilleur Artiste Français 2024',
  status: 'ACTIVE',
};

const mockImages: ContestantImage[] = [
  { id: '1', contestantId: '1', contestantName: 'Marie Dubois', contestantImage: '/contestants/marie.jpg', url: '/gallery/marie-1.jpg', likes: 1240, isWinner: true },
  { id: '2', contestantId: '1', contestantName: 'Marie Dubois', contestantImage: '/contestants/marie.jpg', url: '/gallery/marie-2.jpg', likes: 890 },
  { id: '3', contestantId: '2', contestantName: 'Jean Martin', contestantImage: '/contestants/jean.jpg', url: '/gallery/jean-1.jpg', likes: 756 },
  { id: '4', contestantId: '3', contestantName: 'Sophie Bernard', contestantImage: '/contestants/sophie.jpg', url: '/gallery/sophie-1.jpg', likes: 654 },
  { id: '5', contestantId: '4', contestantName: 'Lucas Petit', contestantImage: '/contestants/lucas.jpg', url: '/gallery/lucas-1.jpg', likes: 543 },
  { id: '6', contestantId: '2', contestantName: 'Jean Martin', contestantImage: '/contestants/jean.jpg', url: '/gallery/jean-2.jpg', likes: 432 },
  { id: '7', contestantId: '5', contestantName: 'Emma Robert', contestantImage: '/contestants/emma.jpg', url: '/gallery/emma-1.jpg', likes: 398 },
  { id: '8', contestantId: '3', contestantName: 'Sophie Bernard', contestantImage: '/contestants/sophie.jpg', url: '/gallery/sophie-2.jpg', likes: 367 },
  { id: '9', contestantId: '6', contestantName: 'Thomas Durand', contestantImage: '/contestants/thomas.jpg', url: '/gallery/thomas-1.jpg', likes: 321 },
  { id: '10', contestantId: '7', contestantName: 'Chloe Moreau', contestantImage: '/contestants/chloe.jpg', url: '/gallery/chloe-1.jpg', likes: 298 },
  { id: '11', contestantId: '4', contestantName: 'Lucas Petit', contestantImage: '/contestants/lucas.jpg', url: '/gallery/lucas-2.jpg', likes: 276 },
  { id: '12', contestantId: '8', contestantName: 'Alexandre Laurent', contestantImage: '/contestants/alexandre.jpg', url: '/gallery/alexandre-1.jpg', likes: 254 },
];

function GalleryImage({ image, onClick }: { image: ContestantImage; onClick: () => void }) {
  return (
    <div 
      className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer"
      onClick={onClick}
    >
      <Image
        src={image.url}
        alt={image.caption || `Photo de ${image.contestantName}`}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold truncate">{image.contestantName}</p>
              {image.caption && (
                <p className="text-gray-300 text-sm truncate">{image.caption}</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-white">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="font-medium">{image.likes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Winner badge */}
      {image.isWinner && (
        <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
          🏆 Gagnant
        </div>
      )}
    </div>
  );
}

function Lightbox({ image, onClose }: { image: ContestantImage | null; onClose: () => void }) {
  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation */}
      <button className="absolute left-4 text-white hover:text-gray-300 transition-colors">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Image */}
      <div className="max-w-4xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.url}
          alt={image.caption || `Photo de ${image.contestantName}`}
          width={800}
          height={800}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
        
        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-white font-semibold text-lg">{image.contestantName}</p>
          {image.caption && (
            <p className="text-gray-400 mt-1">{image.caption}</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-3 text-gray-300">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span>{image.likes.toLocaleString()} mentions j&apos;aime</span>
          </div>
        </div>
      </div>

      <button className="absolute right-4 text-white hover:text-gray-300 transition-colors">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}

export default function GalleryPage() {
  const params = useParams();
  const contestId = params?.id as string;

  const [contest, setContest] = useState<Contest | null>(null);
  const [images, setImages] = useState<ContestantImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ContestantImage | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');

  const fetchGallery = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContest(mockContest);
      setImages(mockImages);
    } catch (err) {
      setError('Impossible de charger la galerie');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (contestId) {
      fetchGallery();
    }
  }, [contestId]);

  // Get unique contestants for filter
  const contestants = [...new Map(images.map(img => [img.contestantId, img])).values()];

  const filteredImages = filter === 'all' 
    ? images 
    : images.filter(img => img.contestantId === filter);

  // Sort by likes for "popular" view
  const sortedImages = [...filteredImages].sort((a, b) => b.likes - a.likes);

  const handleRetry = () => {
    fetchGallery();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center mb-12">
            <LoadingSpinner size="lg" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <ErrorAlert
          message={error}
          actionLabel="Réessayer"
          onAction={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">📸</span>
            <h1 className="text-4xl md:text-5xl font-bold">Galerie Photos</h1>
          </div>
          <h2 className="text-xl text-purple-100 mb-6">{contest?.title}</h2>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8">
            <div>
              <p className="text-3xl font-bold">{images.length}</p>
              <p className="text-sm text-purple-200">Photos</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{contestants.length}</p>
              <p className="text-sm text-purple-200">Participants</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{images.reduce((acc, img) => acc + img.likes, 0).toLocaleString()}</p>
              <p className="text-sm text-purple-200">Mentions j&apos;aime</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters & View Toggle */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Toutes
              </button>
              {contestants.map((img) => (
                <button
                  key={img.contestantId}
                  onClick={() => setFilter(img.contestantId)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === img.contestantId
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <div className="w-6 h-6 relative rounded-full overflow-hidden">
                    <Image
                      src={img.contestantImage}
                      alt={img.contestantName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {img.contestantName.split(' ')[0]}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'masonry' ? 'bg-white shadow text-purple-600' : 'text-gray-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                  </svg>
                </button>
              </div>

              {/* Share */}
              <ShareButton
                url={`/votes/${contestId}/gallery`}
                title={`Galerie - ${contest?.title}`}
                description="Découvrez les photos des participants !"
                variant="icon"
                size="md"
              />
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        {sortedImages.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4'
          }>
            {sortedImages.map((image) => (
              <GalleryImage
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📷</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune photo
            </h3>
            <p className="text-gray-600">
              Aucune photo disponible pour le moment.
            </p>
          </div>
        )}

        {/* Load More */}
        {sortedImages.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-white text-purple-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow border border-purple-200">
              Charger plus de photos
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 py-12 mt-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Vous êtes participant ?
          </h3>
          <p className="text-purple-100 mb-6">
            Ajoutez vos meilleures photos à la galerie !
          </p>
          <Link
            href={`/votes/${contestId}/participate`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors"
          >
            Ajouter une photo
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <Lightbox
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

