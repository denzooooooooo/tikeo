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
      sortBy?: string;
    } = {},
  ) {
    const { type, read, page = 1, limit = 20, sortBy } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    
    if (type) {
      where.type = type;
    }
    
    if (read !== undefined) {
      where.read = read;
    }

    // Build orderBy
    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    else if (sortBy === 'unread') orderBy = [{ read: 'asc' }, { createdAt: 'desc' }];

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy,
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
      data: { read: true, readAt: new Date() },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: { read: true, readAt: new Date() },
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
    // Convert data object to JSON string for storage
    const dataStr = data.data ? JSON.stringify(data.data) : null;

    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: dataStr,
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
    const data = notifications.map(n => ({
      userId: n.userId,
      type: n.type,
      title: n.title,
      message: n.message,
      data: n.data ? JSON.stringify(n.data) : null,
      read: false,
    }));

    return this.prisma.notification.createMany({
      data,
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

  // Send notification to multiple users
  async sendNotificationToUsers(
    userIds: string[],
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>,
  ) {
    const notifications = userIds.map(userId => ({
      userId,
      type: type as any,
      title,
      message,
      data: data ? JSON.stringify(data) : null,
      read: false,
    }));

    await this.prisma.notification.createMany({
      data: notifications as any,
    });

    return userIds.map(id => ({ userId: id, success: true }));
  }

  // Get users for broadcast
  async getUsersForBroadcast(targetRole?: string) {
    const where: any = {};
    
    if (targetRole === 'organizers') {
      where.role = 'ORGANIZER';
    } else if (targetRole === 'customers') {
      where.role = 'USER';
    }

    const users = await this.prisma.user.findMany({
      where,
      select: { id: true, email: true, firstName: true },
      take: 1000,
    });

    return users;
  }

  // Get notification templates
  getNotificationTemplates() {
    return [
      {
        id: 'TICKET_READY',
        type: 'TICKET_READY',
        emoji: '🎫',
        label: 'Billets prêts',
        title: 'Vos billets sont prêts!',
        message: 'Vos billets pour l\'événement sont désormais disponibles.',
        defaultTitle: 'Vos billets sont prêts!',
        defaultMessage: 'Vos billets pour l\'événement {eventName} sont désormais disponibles.',
      },
      {
        id: 'EVENT_REMINDER',
        type: 'EVENT_REMINDER',
        emoji: '⏰',
        label: 'Rappel événement',
        title: 'Rappel: événement à venir',
        message: 'N\'oubliez pas votre événement!',
        defaultTitle: 'Rappel: {eventName} commence bientôt',
        defaultMessage: 'Votre événement {eventName} aura lieu le {eventDate}.',
      },
      {
        id: 'PAYMENT_RECEIVED',
        type: 'PAYMENT_RECEIVED',
        emoji: '💰',
        label: 'Paiement reçu',
        title: 'Paiement effectué',
        message: 'Un paiement a été effectué sur votre compte.',
        defaultTitle: 'Paiement reçu!',
        defaultMessage: 'Un paiement de {amount} a été effectué vers votre compte.',
      },
      {
        id: 'EVENT_CANCELLED',
        type: 'EVENT_CANCELLED',
        emoji: '❌',
        label: 'Événement annulé',
        title: 'Événement annulé',
        message: 'Un événement que vous suivez a été annulé.',
        defaultTitle: 'Événement annulé: {eventName}',
        defaultMessage: 'L\'événement {eventName} a été annulé. Un remboursement sera effectué.',
      },
      {
        id: 'REVIEW_REQUEST',
        type: 'REVIEW_REQUEST',
        emoji: '⭐',
        label: 'Demande d\'avis',
        title: 'Partagez votre expérience',
        message: 'Votre avis nous aide à améliorer.',
        defaultTitle: 'Partagez votre expérience',
        defaultMessage: 'Vous avez assisté à {eventName}. Partagez votre expérience!',
      },
      {
        id: 'MARKETING',
        type: 'MARKETING',
        emoji: '🏷️',
        label: 'Promotion',
        title: 'Offre spéciale',
        message: 'Profitez de notre offre exclusive!',
        defaultTitle: 'Offre exclusive: {offerName}',
        defaultMessage: 'Nous avons une offre spéciale pour vous! Code: {promoCode}',
      },
      {
        id: 'SYSTEM',
        type: 'SYSTEM',
        emoji: '🔔',
        label: 'Système',
        title: 'Information importante',
        message: 'Une information importante de Tikeo.',
        defaultTitle: '{systemTitle}',
        defaultMessage: '{systemMessage}',
      },
      {
        id: 'NEW_FOLLOWER',
        type: 'NEW_FOLLOWER',
        emoji: '👤',
        label: 'Nouvel abonné',
        title: 'Nouvel abonné',
        message: 'Quelqu\'un vous suit maintenant.',
        defaultTitle: 'Nouvel abonné!',
        defaultMessage: '{followerName} s\'est abonné à votre profil.',
      },
      {
        id: 'RECOMMENDATION',
        type: 'RECOMMENDATION',
        emoji: '✨',
        label: 'Recommandation',
        title: 'Nous vous recommandons',
        message: 'Découvrez des événements similaires.',
        defaultTitle: 'Basé sur vos préférences',
        defaultMessage: 'Nous pensons que {eventName} vous plaira!',
      },
    ];
  }

  // Get notification history (admin)
  async getNotificationHistory(filters: {
    userId?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const { userId, type, page, limit } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (type) where.type = type;

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          user: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

