import { Controller, Post, Get, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ============ EVENT REVIEWS ============

  @Post('events/:eventId')
  @UseGuards(JwtAuthGuard)
  async createEventReview(
    @Request() req: any,
    @Param('eventId') eventId: string,
    @Body() body: { rating: number; title?: string; content?: string },
  ) {
    return this.reviewsService.createEventReview(req.user.id, eventId, body);
  }

  @Put('events/:reviewId')
  @UseGuards(JwtAuthGuard)
  async updateEventReview(
    @Request() req: any,
    @Param('reviewId') reviewId: string,
    @Body() body: { rating?: number; title?: string; content?: string },
  ) {
    return this.reviewsService.updateEventReview(req.user.id, reviewId, body);
  }

  @Delete('events/:reviewId')
  @UseGuards(JwtAuthGuard)
  async deleteEventReview(@Request() req: any, @Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteEventReview(req.user.id, reviewId);
  }

  @Get('events/:eventId')
  async getEventReviews(
    @Param('eventId') eventId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.reviewsService.getEventReviews(eventId, parseInt(page), parseInt(limit));
  }

  @Get('user/me')
  @UseGuards(JwtAuthGuard)
  async getUserReviews(
    @Request() req: any,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.reviewsService.getUserReviews(req.user.id, parseInt(page), parseInt(limit));
  }

  // ============ ORGANIZER REVIEWS ============

  @Post('organizers/:organizerId')
  @UseGuards(JwtAuthGuard)
  async createOrganizerReview(
    @Request() req: any,
    @Param('organizerId') organizerId: string,
    @Body() body: { rating: number; title?: string; content?: string },
  ) {
    return this.reviewsService.createOrganizerReview(req.user.id, organizerId, body);
  }

  @Get('organizers/:organizerId')
  async getOrganizerReviews(
    @Param('organizerId') organizerId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.reviewsService.getOrganizerReviews(organizerId, parseInt(page), parseInt(limit));
  }
}

