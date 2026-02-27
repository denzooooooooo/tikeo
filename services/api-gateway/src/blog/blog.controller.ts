import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get('categories')
  async getCategories() {
    return this.blogService.getBlogCategories();
  }

  @Get('posts')
  async getPosts(
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('author') author?: string,
    @Query('featured') featured?: string,
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blogService.getBlogPosts({
      category,
      tag,
      author,
      featured: featured === 'true',
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 12,
    });
  }

  @Get('posts/featured')
  async getFeaturedPosts(@Query('limit') limit?: string) {
    return this.blogService.getFeaturedPosts(limit ? parseInt(limit) : 3);
  }

  @Get('posts/popular')
  async getPopularPosts(@Query('limit') limit?: string) {
    return this.blogService.getPopularPosts(limit ? parseInt(limit) : 5);
  }

  @Get('posts/recent')
  async getRecentPosts(@Query('limit') limit?: string) {
    return this.blogService.getRecentPosts(limit ? parseInt(limit) : 5);
  }

  @Get('tags')
  async getAllTags() {
    return this.blogService.getAllTags();
  }

  @Get('posts/:slug')
  async getPostBySlug(@Param('slug') slug: string) {
    try {
      return await this.blogService.getBlogPostBySlug(slug);
    } catch (error) {
      return { error: 'Post not found', statusCode: 404 };
    }
  }

  @Post('posts/:slug/like')
  @HttpCode(HttpStatus.OK)
  async likePost(@Param('slug') slug: string) {
    try {
      return await this.blogService.likePost(slug);
    } catch (error) {
      return { error: 'Post not found', statusCode: 404 };
    }
  }

  @Get('related/:slug')
  async getRelatedPosts(
    @Param('slug') slug: string,
    @Query('limit') limit?: string,
  ) {
    try {
      const post = await this.blogService.getBlogPostBySlug(slug);
      return this.blogService.getRelatedPosts(post.category, post.id, limit ? parseInt(limit) : 3);
    } catch {
      return [];
    }
  }
}

