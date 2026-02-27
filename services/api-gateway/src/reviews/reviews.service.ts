import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // ============ EVENT REVIEWS ============

  async createEventReview(userId: string, eventId: string, data: {
    rating: number;
    title?: string;
    content?: string;
  }) {
    // Check if event exists
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Événement non trouvé');
    }

    // Check if user already reviewed
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, eventId },
    });

    if (existingReview) {
      throw new BadRequestException('Vous avez déjà noté cet événement');
    }

    // Check if user attended the event (has a ticket)
    const hasTicket = await this.prisma.ticket.findFirst({
      where: { userId, eventId, status: 'VALID' },
    });

    if (!hasTicket) {
      throw new BadRequestException('Vous devez avoir assisté à cet événement pour laisser un avis');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        eventId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        type: 'EVENT',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Update event average rating
    await this.updateEventRating(eventId);

    return review;
  }

  async updateEventReview(userId: string, reviewId: string, data: {
    rating?: number;
    title?: string;
    content?: string;
  }) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: {
        ...(data.rating && { rating: data.rating }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Update event average rating
    await this.updateEventRating(review.eventId);

    return updatedReview;
  }

  async deleteEventReview(userId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: { id: reviewId, userId },
    });

    if (!review) {
      throw new NotFoundException('Avis non trouvé');
    }

    const eventId = review.eventId;
    await this.prisma.review.delete({ where: { id: reviewId } });

    // Update event average rating
    await this.updateEventRating(eventId);

    return { success: true, message: 'Avis supprimé' };
  }

  async getEventReviews(eventId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { eventId, type: 'EVENT' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { eventId, type: 'EVENT' } }),
    ]);

    // Calculate average
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      select: { averageRating: true, totalReviews: true },
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating: event?.averageRating || 0,
      totalReviews: event?.totalReviews || 0,
    };
  }

  async getUserReviews(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        include: {
          event: {
            select: { id: true, title: true, coverImage: true, startDate: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // ============ ORGANIZER REVIEWS ============

  async createOrganizerReview(userId: string, organizerId: string, data: {
    rating: number;
    title?: string;
    content?: string;
  }) {
    const organizer = await this.prisma.organizer.findUnique({ where: { id: organizerId } });
    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    const existingReview = await this.prisma.review.findFirst({
      where: { userId, organizerId },
    });

    if (existingReview) {
      throw new BadRequestException('Vous avez déjà noté cet organisateur');
    }

    const review = await this.prisma.review.create({
      data: {
        userId,
        organizerId,
        rating: data.rating,
        title: data.title,
        content: data.content,
        type: 'ORGANIZER',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Update organizer rating
    await this.updateOrganizerRating(organizerId);

    return review;
  }

  async getOrganizerReviews(organizerId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { organizerId, type: 'ORGANIZER' },
        include: {
          user: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.review.count({ where: { organizerId, type: 'ORGANIZER' } }),
    ]);

    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
      select: { rating: true },
    });

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      averageRating: organizer?.rating || 0,
      totalReviews: total,
    };
  }

  // ============ HELPER METHODS ============

  private async updateEventRating(eventId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: { eventId, type: 'EVENT' },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        averageRating: aggregations._avg.rating || 0,
        totalReviews: aggregations._count.id,
      },
    });
  }

  private async updateOrganizerRating(organizerId: string) {
    const aggregations = await this.prisma.review.aggregate({
      where: { organizerId, type: 'ORGANIZER' },
      _avg: { rating: true },
    });

    await this.prisma.organizer.update({
      where: { id: organizerId },
      data: {
        rating: aggregations._avg.rating || 0,
      },
    });
  }
}

