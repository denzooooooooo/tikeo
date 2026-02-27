import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: Date;
}

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async getNotifications(
    userId: string,
    filters: {
      type?: string;
      read?: boolean;
      page?: number;
      limit?: number;
    } = {},
  ) {
    const { type, read, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (read !== undefined) {
      where.read = read;
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unreadCount,
      },
    };
  }

  async getNotificationById(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true },
    });
  }

  async deleteNotification(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    return { success: true };
  }

  async deleteAllNotifications(userId: string) {
    await this.prisma.notification.deleteMany({
      where: { userId },
    });

    return { success: true };
  }

  async createNotification(data: {
    userId: string;
    type: 'EVENT_REMINDER' | 'TICKET_PURCHASED' | 'TICKET_TRANSFERRED' | 'EVENT_UPDATED' | 'EVENT_CANCELLED' | 'REFUND_PROCESSED' | 'RECOMMENDATION' | 'MARKETING' | 'SYSTEM';
    title: string;
    message: string;
    data?: Record<string, any>;
  }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        data: data.data,
        read: false,
      },
    });
  }

  // Bulk create notifications
  async createBulkNotifications(
    notifications: Array<{
      userId: string;
      type: 'EVENT_REMINDER' | 'TICKET_PURCHASED' | 'TICKET_TRANSFERRED' | 'EVENT_UPDATED' | 'EVENT_CANCELLED' | 'REFUND_PROCESSED' | 'RECOMMENDATION' | 'MARKETING' | 'SYSTEM';
      title: string;
      message: string;
      data?: Record<string, any>;
    }>,
  ) {
    return this.prisma.notification.createMany({
      data: notifications.map(n => ({
        ...n,
        type: n.type as any,
        read: false,
      })) as any,
    });
  }

  async getNotificationPreferences(userId: string) {
    const preferences = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Return default preferences
      return {
        email: true,
        push: true,
        sms: false,
        orderConfirmation: true,
        eventReminders: true,
        newEvents: true,
        promotions: false,
        organizerUpdates: true,
      };
    }

    return preferences;
  }

  async updateNotificationPreferences(
    userId: string,
    preferences: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      orderConfirmation?: boolean;
      eventReminders?: boolean;
      newEvents?: boolean;
      promotions?: boolean;
      organizerUpdates?: boolean;
    },
  ) {
    return this.prisma.notificationPreference.upsert({
      where: { userId },
      update: preferences,
      create: {
        userId,
        ...preferences,
      },
    });
  }

  // Notification types
  static readonly TYPES = {
    ORDER_CONFIRMATION: 'order_confirmation',
    TICKET_READY: 'ticket_ready',
    EVENT_REMINDER: 'event_reminder',
    EVENT_UPDATE: 'event_update',
    EVENT_CANCELLED: 'event_cancelled',
    NEW_EVENT: 'new_event',
    FAVORITE_ON_SALE: 'favorite_on_sale',
    PRICE_DROP: 'price_drop',
    REVIEW_REQUEST: 'review_request',
    PAYMENT_RECEIVED: 'payment_received',
    NEW_FOLLOWER: 'new_follower',
    COMMENT: 'comment',
    LIKE: 'like',
    SYSTEM: 'system',
  };
}

