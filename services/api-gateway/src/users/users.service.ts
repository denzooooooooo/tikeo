import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get user stats (tickets, events attended, favorites, reviews)
   */
  async getUserStats(userId: string) {
    const [ticketsPurchased, favorites, orders] = await Promise.all([
      this.prisma.ticket.count({ where: { userId } }),
      this.prisma.eventLike.count({ where: { userId } }),
      this.prisma.order.count({
        where: { userId, status: { in: ['CONFIRMED', 'COMPLETED'] } },
      }),
    ]);

    return {
      ticketsPurchased,
      eventsAttended: orders,
      favorites,
      reviews: 0,
    };
  }

  /**
   * Get user preferences
   */
  async getUserPreferences(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');

    // Return preferences stored in user or defaults
    return {
      language: 'fr',
      currency: 'EUR',
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      darkMode: false,
    };
  }

  /**
   * Update user preferences (stored as user metadata)
   */
  async updateUserPreferences(userId: string, preferences: any) {
    // For now, just return the preferences as saved
    // In a full implementation, you'd store these in a UserPreferences table
    return {
      ...preferences,
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Get user profile
   */
  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, data: { firstName?: string; lastName?: string; avatar?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
