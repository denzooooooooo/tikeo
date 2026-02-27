import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getUserFavorites(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      this.prisma.favorite.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              organizer: {
                select: {
                  id: true,
                  companyName: true,
                  logo: true,
                  verified: true,
                },
              },
              ticketTypes: {
                where: { isActive: true },
                orderBy: { price: 'asc' },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.favorite.count({ where: { userId } }),
    ]);

    return {
      data: favorites.map((fav) => ({
        id: fav.id,
        eventId: fav.event.id,
        title: fav.event.title,
        slug: fav.event.slug,
        coverImage: fav.event.coverImage,
        shortDescription: fav.event.shortDescription,
        category: fav.event.category,
        venueName: fav.event.venueName,
        venueCity: fav.event.venueCity,
        venueCountry: fav.event.venueCountry,
        startDate: fav.event.startDate,
        endDate: fav.event.endDate,
        minPrice: fav.event.minPrice,
        maxPrice: fav.event.maxPrice,
        isFeatured: fav.event.isFeatured,
        organizer: fav.event.organizer,
        createdAt: fav.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async addFavorite(userId: string, eventId: string) {
    // Check if event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Check if already favorited
    const existing = await this.prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Event already in favorites');
    }

    // Add to favorites
    const favorite = await this.prisma.favorite.create({
      data: {
        userId,
        eventId,
      },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                id: true,
                companyName: true,
                logo: true,
                verified: true,
              },
            },
          },
        },
      },
    });

    // Increment event likes
    await this.prisma.event.update({
      where: { id: eventId },
      data: { likes: { increment: 1 } },
    });

    return favorite;
  }

  async removeFavorite(userId: string, eventId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorite not found');
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });

    // Decrement event likes
    await this.prisma.event.update({
      where: { id: eventId },
      data: { likes: { decrement: 1 } },
    });

    return { success: true };
  }

  async isFavorite(userId: string, eventId: string): Promise<boolean> {
    const favorite = await this.prisma.favorite.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });
    return !!favorite;
  }

  async toggleFavorite(userId: string, eventId: string) {
    const isFavorited = await this.isFavorite(userId, eventId);

    if (isFavorited) {
      await this.removeFavorite(userId, eventId);
      return { isFavorite: false };
    } else {
      await this.addFavorite(userId, eventId);
      return { isFavorite: true };
    }
  }

  async getFavoriteIds(userId: string): Promise<string[]> {
    const favorites = await this.prisma.favorite.findMany({
      where: { userId },
      select: { eventId: true },
    });
    return favorites.map((f) => f.eventId);
  }
}

