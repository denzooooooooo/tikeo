'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  SearchIcon,
  CalendarIcon,
  ClockIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  NewspaperIcon,
  BookOpenIcon,
  LightbulbIcon,
  MicrophoneIcon,
  MaskIcon,
} from '@tikeo/ui';

const categories = [
  { id: 'all', name: 'Tout', icon: NewspaperIcon, count: 156 },
  { id: 'news', name: 'Actualités', icon: NewspaperIcon, count: 42 },
  { id: 'guides', name: 'Guides', icon: BookOpenIcon, count: 38 },
  { id: 'tips', name: 'Conseils', icon: LightbulbIcon, count: 27 },
  { id: 'interviews', name: 'Interviews', icon: MicrophoneIcon, count: 18 },
  { id: 'culture', name: 'Culture', icon: MaskIcon, count: 31 },
];

const featuredPosts = [
  {
    id: '1',
    title: 'Tikeo lève 10 millions d\'euros pour révolutionner la billetterie en Europe',
    excerpt: 'La startup française annonce une levée de fonds majeure pour accélérer son développement et s\'étendre à de nouveaux marchés.',
    coverImage: 'https://picsum.photos/seed/blog1/1200/600',
    category: 'news',
    author: { name: 'Marie Dupont', avatar: 'https://i.pravatar.cc/150?u=marie' },
    publishedAt: '2024-03-15',
    readingTime: 5,
    views: 12456,
  },
];

const recentPosts = [
  {
    id: '2',
    title: 'Comment organiser un événement écoresponsable en 2024',
    excerpt: 'Guide complet pour réduire l\'empreinte carbone de vos événements.',
    coverImage: 'https://picsum.photos/seed/blog2/800/400',
    category: 'guides',
    author: { name: 'Thomas Martin', avatar: 'https://i.pravatar.cc/150?u=thomas' },
    publishedAt: '2024-03-14',
    readingTime: 12,
    views: 8934,
  },
  {
    id: '3',
    title: 'Les tendances musicales de l\'été 2024',
    excerpt: 'Du jazz au techno, voici les styles musicaux qui vont marquer la saison.',
    coverImage: 'https://picsum.photos/seed/blog3/800/400',
    category: 'culture',
    author: { name: 'Sophie Bernard', avatar: 'https://i.pravatar.cc/150?u=sophie' },
    publishedAt: '2024-03-13',
    readingTime: 8,
    views: 7654,
  },
  {
    id: '4',
    title: '5 conseils pour vendre plus de billets en ligne',
    excerpt: 'Stratégies éprouvées pour maximiser vos ventes de billets.',
    coverImage: 'https://picsum.photos/seed/blog4/800/400',
    category: 'tips',
    author: { name: 'Lucas Petit', avatar: 'https://i.pravatar.cc/150?u=lucas' },
    publishedAt: '2024-03-12',
    readingTime: 6,
    views: 5432,
  },
  {
    id: '5',
    title: 'Interview: Le directeur du Festival de Jazz de Paris',
    excerpt: 'Exclusive: Découvrez les coulisses du festival.',
    coverImage: 'https://picsum.photos/seed/blog5/800/400',
    category: 'interviews',
    author: { name: 'Emma Wilson', avatar: 'https://i.pravatar.cc/150?u=emma' },
    publishedAt: '2024-03-11',
    readingTime: 15,
    views: 12345,
  },
  {
    id: '6',
    title: 'Guide complet: Créer votre premier événement sur Tikeo',
    excerpt: 'Tutoriel étape par étape pour lancer votre événement.',
    coverImage: 'https://picsum.photos/seed/blog6/800/400',
    category: 'guides',
    author: { name: 'Marie Dupont', avatar: 'https://i.pravatar.cc/150?u=marie' },
    publishedAt: '2024-03-10',
    readingTime: 10,
    views: 9876,
  },
  {
    id: '7',
    title: 'Pourquoi les événements hybrides sont l\'avenir du secteur',
    excerpt: 'Analyse des avantages du format hybride.',
    coverImage: 'https://picsum.photos/seed/blog7/800/400',
    category: 'tips',
    author: { name: 'Thomas Martin', avatar: 'https://i.pravatar.cc/150?u=thomas' },
    publishedAt: '2024-03-09',
    readingTime: 7,
    views: 6543,
  },
];

const popularTags = ['festival', 'concert', 'jazz', 'techno', 'événementiel', 'billetterie', 'marketing', 'musique', 'culture', 'art'];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

interface Post {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  author: { name: string; avatar: string };
  publishedAt: string;
  readingTime: number;
  views: number;
}

function FeaturedPostCard({ post }: { post: Post }) {
  const categoryData = categories.find(c => c.id === post.category);
  const CategoryIcon = categoryData ? categoryData.icon : NewspaperIcon;
  return (
    <div className="relative h-[500px] rounded-3xl overflow-hidden group">
      <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="px-4 py-1 bg-[#5B7CFF] text-white text-sm font-semibold rounded-full flex items-center gap-2">
            <CategoryIcon size={16} />{categoryData ? categoryData.name : post.category}
          </span>
          <span className="text-white/80 text-sm flex items-center gap-1"><CalendarIcon size={16} />{formatDate(post.publishedAt)}</span>
          <span className="text-white/80 text-sm flex items-center gap-1"><ClockIcon size={16} />{post.readingTime} min</span>
        </div>
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h2>
        <p className="text-white/90 text-lg mb-6 max-w-2xl line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden"><Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="w-full h-full object-cover" /></div>
            <span className="text-white font-medium">{post.author.name}</span>
          </div>
          <Link href={`/blog/${post.id}`} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">Lire la suite <ArrowRightIcon size={20} /></Link>
        </div>
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const categoryData = categories.find(c => c.id === post.category);
  const CategoryIcon = categoryData ? categoryData.icon : NewspaperIcon;
  return (
    <Link href={`/blog/${post.id}`} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-semibold rounded-full flex items-center gap-1"><CategoryIcon size={12} />{categoryData ? categoryData.name : post.category}</span></div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1"><CalendarIcon size={14} />{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1"><ClockIcon size={14} />{post.readingTime} min</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#5B7CFF] transition-colors mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden"><Image src={post.author.avatar} alt={post.author.name} width={32} height={32} className="w-full h-full object-cover" /></div>
            <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
          </div>
          <span className="text-sm text-gray-500">{post.views.toLocaleString()} lectures</span>
        </div>
      </div>
    </Link>
  );
}

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  const filteredPosts = recentPosts.filter(post => {
    const matchesSearch = searchQuery === '' || post.title.toLowerCase().includes(searchQuery.toLowerCase()) || post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

  const handleNewsletterSubmit = (e: FormEvent) => { e.preventDefault(); if (newsletterEmail) { setNewsletterSubscribed(true); setNewsletterEmail(''); } };
  const handleSearch = (e: FormEvent) => { e.preventDefault(); setCurrentPage(1); };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-10">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"><NewspaperIcon className="text-white" size={48} /></div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Blog Tikeo</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">Actualités, conseils et bonnes pratiques pour organiser et découvrir des événements inoubliables</p>
          </div>
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-6 py-4"><SearchIcon className="text-gray-400 mr-4" size={24} /><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Rechercher un article..." className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-400 text-lg" /></div>
                <button type="submit" className="px-8 py-4 bg-gradient-to-r from-[#5B7CFF] to-[#7B61FF] text-white font-semibold hover:shadow-lg transition-all duration-200">Rechercher</button>
              </div>
            </form>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" /></svg></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex overflow-x-auto gap-3 pb-6 mb-8 scrollbar-hide">
          {categories.map((category) => { const IconComponent = category.icon; return (<button key={category.id} onClick={() => { setActiveCategory(category.id); setCurrentPage(1); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === category.id ? 'bg-[#5B7CFF] text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}><IconComponent size={18} /><span>{category.name}</span><span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === category.id ? 'bg-white/20' : 'bg-gray-200'}`}>{category.count}</span></button>); })}
        </div>
        {activeCategory === 'all' && searchQuery === '' && (<div className="mb-12"><FeaturedPostCard post={featuredPosts[0]} /></div>)}
        <div className="flex flex-wrap items-center gap-3 mb-8"><TagIcon className="text-gray-400" size={20} /><span className="text-sm text-gray-500">Tags populaires :</span>{popularTags.map((tag) => (<Link key={tag} href={`/blog?tag=${tag}`} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-[#5B7CFF] hover:text-white transition-colors">#{tag}</Link>))}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {paginatedPosts.length > 0 ? (paginatedPosts.map((post) => <PostCard key={post.id} post={post} />)) : (<div className="col-span-full text-center py-12"><p className="text-gray-500 text-lg">Aucun article ne correspond à votre recherche.</p><button onClick={() => { setSearchQuery(''); setActiveCategory('all'); setCurrentPage(1); }} className="mt-4 text-[#5B7CFF] font-medium hover:underline">Réinitialiser les filtres</button></div>)}
        </div>
        <div className="bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-3xl p-8 lg:p-12 text-white mb-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left"><h2 className="text-3xl lg:text-4xl font-bold mb-4">Restez informé</h2><p className="text-white/90 text-lg max-w-xl">Recevez nos dernières actualités, conseils et bons plans directement dans votre boîte mail.</p></div>
            {newsletterSubscribed ? (<div className="flex items-center gap-3 text-green-300 bg-white/10 px-6 py-4 rounded-xl"><span className="text-xl">✓</span><span className="font-medium">Merci pour votre inscription !</span></div>) : (<form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"><input type="email" value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Votre email..." required className="px-6 py-4 rounded-xl text-gray-900 w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-white" /><button type="submit" className="px-8 py-4 bg-white text-[#5B7CFF] rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">S&apos;abonner</button></form>)}
          </div>
        </div>
        {totalPages > 1 && (<div className="flex items-center justify-center gap-2"><button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ChevronLeftIcon size={20} /></button>{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (<button key={page} onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === page ? 'bg-[#5B7CFF] text-white' : 'border border-gray-200 text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF]'}`}>{page}</button>))}<button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-3 rounded-lg border border-gray-200 text-gray-600 hover:border-[#5B7CFF] hover:text-[#5B7CFF] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><ChevronRightIcon size={20} /></button></div>)}
      </div>
    </div>
  );
}
