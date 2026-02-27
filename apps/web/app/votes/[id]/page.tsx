'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ContestantCard, ShareButton, LoadingSpinner, ErrorAlert, EmptyState } from '@tikeo/ui';
import { 
  TrophyIcon, 
  UsersIcon, 
  ClockIcon, 
  HeartIcon, 
  ShareIcon, 
  CalendarIcon,
  ChevronRightIcon,
  FlameIcon,
  StarIcon,
  VerifiedIcon,
  ArrowLeftIcon,
  DollarIcon
} from '@tikeo/ui';
import { useAuth } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface Contest {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  coverImage: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  prize?: string;
  rules?: string;
  organizerId: string;
  maxContestants: number;
  currentContestants: number;
  votesPerUser: number;
  isPublicResults: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  organizer?: {
    id: string;
    companyName: string;
    logo?: string;
    verified: boolean;
  };
}

interface Contestant {
  id: string;
  contestId: string;
  userId: string;
  name: string;
  bio?: string;
  mainImage: string;
  images: string[];
  votesCount: number;
  rank?: number;
  status: string;
  isWinner: boolean;
  winnerPosition?: number;
  socialLinks?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
  };
}

// API functions
async function fetchContest(id: string): Promise<Contest> {
  const response = await fetch(`${API_URL}/contests/${id}`);
  if (!response.ok) {
    throw new Error('Contest not found');
  }
  return response.json();
}

async function fetchContestants(contestId: string): Promise<Contestant[]> {
  const response = await fetch(`${API_URL}/contests/${contestId}/contestants`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return data.contestants || data || [];
}

async function voteForContestant(contestId: string, contestantId: string, token: string) {
  const response = await fetch(`${API_URL}/contests/${contestId}/contestants/${contestantId}/vote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to vote');
  }
  
  return response.json();
}

// Skeleton for loading
function ContestHeaderSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[400px] bg-gray-200 rounded-b-3xl" />
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative">
        <div className="h-48 w-48 bg-gray-200 rounded-xl" />
        <div className="mt-6 h-10 w-3/4 bg-gray-200 rounded" />
        <div className="mt-4 h-6 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function ContestantCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white shadow-md overflow-hidden">
      <div className="h-64 bg-gray-200" />
      <div className="p-4">
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="mt-4 h-8 w-24 bg-gray-200 rounded-full" />
      </div>
    </div>
  );
}

export default function ContestDetailPage() {
  const params = useParams();
  const contestId = params?.id as string;
  const queryClient = useQueryClient();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [hasVoted, setHasVoted] = useState(false);
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Fetch contest data
  const { 
    data: contest, 
    isLoading: loadingContest, 
    error: contestError,
    refetch: refetchContest
  } = useQuery({
    queryKey: ['contest', contestId],
    queryFn: () => fetchContest(contestId),
    enabled: !!contestId,
    staleTime: 30000,
  });

  // Fetch contestants
  const { 
    data: contestants = [], 
    isLoading: loadingContestants,
    error: contestantsError,
    refetch: refetchContestants
  } = useQuery({
    queryKey: ['contestants', contestId],
    queryFn: () => fetchContestants(contestId),
    enabled: !!contestId,
    staleTime: 15000,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: (contestantId: string) => {
      const token = localStorage.getItem('auth_tokens');
      const parsed = token ? JSON.parse(token) : null;
      return voteForContestant(contestId, contestantId, parsed?.accessToken || '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contestants', contestId] });
      queryClient.invalidateQueries({ queryKey: ['contest', contestId] });
    },
  });

  const handleVote = (contestantId: string) => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    
    if (votedIds.includes(contestantId)) {
      // Remove vote (toggle off)
      setVotedIds(prev => prev.filter(id => id !== contestantId));
    } else {
      // Add vote
      if (votedIds.length >= (contest?.votesPerUser || 5)) {
        alert(`Vous avez atteint le nombre maximum de votes (${contest?.votesPerUser || 5})`);
        return;
      }
      
      // Call API to vote
      voteMutation.mutate(contestantId);
      setVotedIds(prev => [...prev, contestantId]);
    }
    setHasVoted(votedIds.length > 0);
  };

  const handleRetry = () => {
    refetchContest();
    refetchContestants();
  };

  // Sort contestants by votes
  const sortedContestants = [...contestants].sort((a, b) => b.votesCount - a.votesCount);

  // Calculate time remaining
  const endDate = contest ? new Date(contest.endDate) : new Date();
  const now = new Date();
  const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const hoursLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60));

  // Loading state
  if (loadingContest || loadingContestants) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ContestHeaderSkeleton />
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div className="h-8 w-48 bg-gray-200 rounded" />
              <div className="flex gap-2">
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
                <div className="h-10 w-10 bg-gray-200 rounded-lg" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ContestantCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (contestError || !contest) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <ErrorAlert
            message="Impossible de charger ce concours. Veuillez réessayer."
            actionLabel="Réessayer"
            onAction={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
      {/* Hero Section - Style Page d'Accueil */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-500">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        {/* Cover Image */}
        <div className="relative h-[450px]">
          <Image
            src={contest.coverImage || 'https://picsum.photos/seed/contest-hero/1920/600'}
            alt={contest.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent" />
        </div>

        {/* Contest Status & Actions */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Link 
              href="/votes"
              className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <span className={`px-4 py-2 rounded-full text-sm font-bold ${
              contest.status === 'ACTIVE' ? 'bg-green-500 text-white' :
              contest.status === 'COMPLETED' ? 'bg-gray-500 text-white' :
              'bg-yellow-500 text-black'
            }`}>
              {contest.status === 'ACTIVE' ? '🟢 En cours' :
               contest.status === 'COMPLETED' ? '🏁 Terminé' :
               '📝 Brouillon'}
            </span>
            {contest.isFeatured && (
              <span className="px-4 py-2 rounded-full text-sm font-bold bg-yellow-500 text-yellow-900 flex items-center gap-1">
                <StarIcon className="w-4 h-4" />
                Vedette
              </span>
            )}
          </div>
          <ShareButton
            url={`/votes/${contest.id}`}
            title={contest.title}
            description={contest.shortDescription}
            size="lg"
          />
        </div>

        {/* Contest Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              {/* Title & Description */}
              <div className="flex-1">
                <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white mb-4">
                  {contest.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  {contest.title}
                </h1>
                {contest.shortDescription && (
                  <p className="text-lg text-white/80 max-w-2xl">
                    {contest.shortDescription}
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-white">{contest.currentContestants}</div>
                  <div className="text-xs text-white/70">Participants</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-white">
                    {contestants.reduce((acc, c) => acc + c.votesCount, 0).toLocaleString()}
                  </div>
                  <div className="text-xs text-white/70">Votes</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-white">
                    {daysLeft > 0 ? `${daysLeft}j` : `${hoursLeft}h`}
                  </div>
                  <div className="text-xs text-white/70">Restant</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="currentColor"
              className="text-gray-50"
            />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Contest Details */}
          <div className="lg:col-span-2">
            {/* Organizer Card */}
            {contest.organizer && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {contest.organizer.logo ? (
                      <Image src={contest.organizer.logo} alt={contest.organizer.companyName} width={56} height={56} className="rounded-full" />
                    ) : (
                      <span className="text-2xl">🏢</span>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Organisé par</p>
                    <p className="font-bold text-gray-900 flex items-center gap-2">
                      {contest.organizer.companyName}
                      {contest.organizer.verified && <VerifiedIcon className="w-5 h-5 text-blue-500" />}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Link
                href={`/votes/${contestId}`}
                className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold shadow-lg"
              >
                Participants
              </Link>
              <Link
                href={`/votes/${contestId}/leaderboard`}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow"
              >
                <TrophyIcon className="w-4 h-4 text-yellow-500" />
                Classement
              </Link>
              <Link
                href={`/votes/${contestId}/gallery`}
                className="px-5 py-2.5 bg-white text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Galerie
              </Link>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-600 whitespace-pre-line">{contest.description}</p>
              
              {contest.rules && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Règles du concours</h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 whitespace-pre-line">{contest.rules}</p>
                  </div>
                </>
              )}

              {/* Votes Info */}
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <UsersIcon className="w-5 h-5" />
                  <span className="font-semibold">Votes par utilisateur</span>
                </div>
                <p className="text-purple-600">
                  Vous pouvez voter pour <strong>{contest.votesPerUser}</strong> participant(s) différent(s).
                  {votedIds.length > 0 && (
                    <span className="block mt-1 text-sm">
                      ({votedIds.length}/{contest.votesPerUser} votes utilisés)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Prize & Sidebar */}
          <div className="lg:col-span-1">
            {/* Prize Card */}
            {contest.prize && (
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-lg p-6 mb-6 text-center">
                <TrophyIcon className="w-12 h-12 text-yellow-900 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-yellow-900 mb-1">Prix à gagner</h3>
                <p className="text-3xl font-bold text-yellow-900">{contest.prize}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                  <HeartIcon className="w-5 h-5" />
                  Participer au concours
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                  <ShareIcon className="w-5 h-5" />
                  Partager avec vos amis
                </button>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg p-6 text-center text-white">
              <ClockIcon className="w-10 h-10 mx-auto mb-3" />
              <h3 className="text-lg font-bold mb-1">Temps restant</h3>
              <p className="text-3xl font-bold">
                {daysLeft > 0 ? `${daysLeft} jours` : `${hoursLeft} heures`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                Participants
              </h2>
              <p className="text-gray-500 mt-1">{contestants.length} participants • Classement par votes</p>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {contestantsError ? (
            <ErrorAlert
              message="Impossible de charger les participants."
              actionLabel="Réessayer"
              onAction={() => refetchContestants()}
            />
          ) : contestants.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {sortedContestants.map((contestant, index) => (
                <ContestantCard
                  key={contestant.id}
                  contestant={contestant}
                  rank={index + 1}
                  hasVoted={votedIds.includes(contestant.id)}
                  onVote={() => handleVote(contestant.id)}
                  showVoting={true}
                  maxVotes={contest.votesPerUser}
                  votesUsed={votedIds.length}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Aucun participant"
              description="Soyez le premier à participer à ce concours !"
              icon={<UsersIcon className="h-12 w-12 text-gray-400" />}
              action={
                isAuthenticated ? (
                  <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors">
                    Participer
                  </button>
                ) : (
                  <Link href="/login" className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors">
                    Connectez-vous pour participer
                  </Link>
                )
              }
            />
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 py-20">
        {/* Animated shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <TrophyIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {votedIds.length > 0 ? 'Merci pour votre participation !' : 'Votez pour vos favoris !'}
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            {votedIds.length > 0 
              ? 'Vous pouvez voter pour d\'autres participants.' 
              : `Vous avez ${contest.votesPerUser} vote(s) disponible(s). Participez au concours maintenant !`}
          </p>
          {!isAuthenticated && (
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
              >
                <HeartIcon className="w-6 h-6" />
                Se connecter pour voter
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

