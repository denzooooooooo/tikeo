import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { HelpService } from './help.service';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('categories')
  async getCategories() {
    return this.helpService.getHelpCategories();
  }

  @Get('faqs')
  async getFAQs(@Query('category') category?: string) {
    return this.helpService.getFAQs(category);
  }

  @Get('articles')
  async getArticles(
    @Query('category') category?: string,
    @Query('limit') limit?: string,
  ) {
    return this.helpService.getArticles(category, limit ? parseInt(limit) : 10);
  }

  @Get('articles/popular')
  async getPopularArticles(@Query('limit') limit?: string) {
    return this.helpService.getPopularArticles(limit ? parseInt(limit) : 5);
  }

  @Get('articles/:slug')
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.helpService.getArticleBySlug(slug);
    if (!article) {
      return { error: 'Article not found', statusCode: 404 };
    }
    return article;
  }

  @Get('search')
  async searchArticles(@Query('q') query: string) {
    if (!query || query.length < 2) {
      return { articles: [], message: 'Query must be at least 2 characters' };
    }
    return this.helpService.searchArticles(query);
  }

  @Post('ticket')
  @HttpCode(HttpStatus.CREATED)
  async submitSupportTicket(
    @Body()
    body: {
      userId: string;
      subject: string;
      message: string;
      category: string;
      orderId?: string;
    },
  ) {
    return this.helpService.submitSupportTicket(body);
  }
}

