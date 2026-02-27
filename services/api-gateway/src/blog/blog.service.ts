import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  likes: number;
  readingTime: number; // in minutes
  featured?: boolean;
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  async getBlogCategories() {
    return [
      { id: 'news', name: 'Actualités', icon: '📰', postCount: 24 },
      { id: 'guides', name: 'Guides & Tutoriels', icon: '📚', postCount: 42 },
      { id: 'tips', name: 'Conseils', icon: '💡', postCount: 31 },
      { id: 'interviews', name: 'Interviews', icon: '🎤', postCount: 18 },
      { id: 'culture', name: 'Culture Events', icon: '🎭', postCount: 27 },
      { id: 'behind-the-scenes', name: 'Dans les coulisses', icon: '🎬', postCount: 15 },
    ];
  }

  async getBlogPosts(filters: {
    category?: string;
    tag?: string;
    author?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { category, tag, author, featured, search, page = 1, limit = 12 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {
      publishedAt: { lte: new Date() },
      status: 'PUBLISHED',
    };

    if (category) where.category = category;
    if (tag) where.tags = { has: tag };
    // Remove author filter - author is a simple string in Prisma schema
    // if (author) where.author = { contains: author, mode: 'insensitive' };
    // Remove featured filter - featured field doesn't exist in Prisma schema
    // if (featured) where.featured = true;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      data: posts.map((post) => ({
        ...post,
        readingTime: this.calculateReadingTime(post.content),
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBlogPostBySlug(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    // Increment views
    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } },
    });

    return {
      ...post,
      readingTime: this.calculateReadingTime(post.content),
    };
  }

  async getFeaturedPosts(limit = 3) {
    // Remove featured filter - field doesn't exist in Prisma schema
    // Return most popular posts instead
    return this.getPopularPosts(limit);
  }

  async getPopularPosts(limit = 5) {
    return this.prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      orderBy: { views: 'desc' },
      take: limit,
    });
  }

  async getRecentPosts(limit = 5) {
    return this.prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async getRelatedPosts(category: string, currentPostId: string, limit = 3) {
    return this.prisma.blogPost.findMany({
      where: {
        category,
        id: { not: currentPostId },
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  async likePost(slug: string) {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug },
    });

    if (!post) {
      throw new NotFoundException('Blog post not found');
    }

    await this.prisma.blogPost.update({
      where: { id: post.id },
      data: { likes: { increment: 1 } },
    });

    return { success: true, likes: post.likes + 1 };
  }

  async getAllTags(): Promise<string[]> {
    const posts = await this.prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      select: { tags: true },
    });

    const tags = new Set<string>();
    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  }

  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

