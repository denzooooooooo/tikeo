import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface CreateOrderDto {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  promoCode?: string;
  /** Informations invité — obligatoires si l'utilisateur n'est pas connecté */
  guestInfo?: GuestInfo;
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private redis: RedisService,
    private notificationsService: NotificationsService,
  ) {}

  async createOrder(userId: string | null, dto: CreateOrderDto) {
    const { eventId, ticketTypeId, quantity, promoCode, guestInfo } = dto;

    // Validation : si pas d'utilisateur connecté, les infos invité sont obligatoires
    if (!userId) {
      if (!guestInfo || !guestInfo.firstName || !guestInfo.lastName || !guestInfo.email) {
        throw new BadRequestException(
          'Les informations personnelles (prénom, nom, email) sont obligatoires pour continuer sans compte.',
        );
      }
      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestInfo.email)) {
        throw new BadRequestException('Adresse email invalide.');
      }
    }

    // Verify event exists and is published
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Événement non trouvé');
    if (event.status !== 'PUBLISHED') {
      throw new BadRequestException(
        event.status === 'DRAFT'
          ? 'Cet événement est en brouillon et n\'est pas disponible à la vente'
          : 'Cet événement n\'est plus disponible à la vente',
      );
    }

    // Verify ticket type exists and has availability
    const ticketType = await this.prisma.ticketType.findFirst({
      where: { id: ticketTypeId, eventId },
    });
    if (!ticketType) throw new NotFoundException('Type de billet non trouvé');
    if (ticketType.available < quantity) {
      throw new BadRequestException('Pas assez de billets disponibles');
    }

    // Calculate amounts
    const subtotal = ticketType.price * quantity;
    const fees = 0;
    const taxes = 0;
    let discount = 0;

    // Apply promo code if provided
    let promoCodeUsed: string | null = null;
    if (promoCode && promoCode !== 'APPLIED') {
      const promo = await this.prisma.promoCode.findFirst({
        where: {
          code: promoCode,
          isActive: true,
          validFrom: { lte: new Date() },
          validUntil: { gte: new Date() },
        },
      });
      if (promo) {
        if (promo.discountType === 'PERCENTAGE') {
          discount = subtotal * (promo.discountValue / 100);
        } else {
          discount = promo.discountValue;
        }
        promoCodeUsed = promoCode;
      }
    }

    const total = subtotal + fees + taxes - discount;

    // Free events are automatically confirmed (no payment needed)
    const isFree = total === 0;

    // Nom complet pour la facturation
    const billingName = userId
      ? undefined // sera rempli depuis le profil utilisateur si besoin
      : `${guestInfo!.firstName} ${guestInfo!.lastName}`;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        ...(userId ? { userId } : {}),
        // Champs invité — castés en any car le client Prisma sera régénéré après migration
        ...((!userId && guestInfo) ? {
          guestEmail: guestInfo.email,
          guestPhone: guestInfo.phone ?? null,
        } : {}),
        billingName: billingName ?? null,
        eventId,
        subtotal,
        fees,
        taxes,
        discount,
        promoCodeUsed,
        total,
        currency: 'EUR',
        status: isFree ? 'CONFIRMED' : 'PENDING',
        paymentMethod: isFree ? 'FREE' : 'STRIPE',
        OrderItem: {
          create: {
            ticketTypeId,
            quantity,
            price: ticketType.price,
          },
        },
      } as any,
      include: {
        OrderItem: true,
      },
    });

    // For free events: generate tickets immediately + send confirmation email
    if (isFree) {
      // ✅ Decrement ticketType.available + update event stats + invalidate cache
      await this.prisma.ticketType.update({
        where: { id: ticketTypeId },
        data: { available: { decrement: quantity }, sold: { increment: quantity } },
      });
      await this.prisma.event.update({
        where: { id: eventId },
        data: {
          ticketsAvailable: { decrement: quantity },
          ticketsSold: { increment: quantity },
        },
      });
      // Invalidate Redis cache so next fetch shows updated availability
      await this.redis.del(`event:${eventId}`);
      await this.redis.del(`event:slug:${event.slug}`);

      const createdTickets: Array<{ id: string; qrCode: string }> = [];
      for (let i = 0; i < quantity; i++) {
        const createdTicket = await this.prisma.ticket.create({
          data: {
            orderId: order.id,
            eventId,
            ...(userId ? { userId } : {}),
            ticketTypeId,
            qrCode: `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            status: 'VALID',
            purchaseDate: new Date(),
            price: 0,
            fees: 0,
            total: 0,
          } as any,
          select: { id: true, qrCode: true },
        });
        createdTickets.push(createdTicket);
      }

      // Déterminer l'email de confirmation (utilisateur connecté ou invité)
      let confirmEmail: string | null = null;
      let confirmFirstName: string | null = null;

      if (userId) {
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { email: true, firstName: true },
        });
        if (user) {
          confirmEmail = user.email;
          confirmFirstName = user.firstName;
        }
      } else if (guestInfo) {
        confirmEmail = guestInfo.email;
        confirmFirstName = guestInfo.firstName;
      }

      if (confirmEmail) {
        // Send order confirmation email (fire and forget)
        this.emailService.sendOrderConfirmationEmail(confirmEmail, {
          orderId: order.id,
          total: 0,
          eventTitle: event.title || 'Événement',
          ticketCount: quantity,
        }).catch(() => {});

        const ticketDesign = {
          template: event.ticketDesignTemplate,
          backgroundUrl: event.ticketDesignBackgroundUrl,
          primaryColor: event.ticketDesignPrimaryColor,
          secondaryColor: event.ticketDesignSecondaryColor,
          textColor: event.ticketDesignTextColor,
          showQr: event.ticketDesignShowQr,
          showSeat: event.ticketDesignShowSeat,
          showTerms: event.ticketDesignShowTerms,
          customTitle: event.ticketDesignCustomTitle,
          footerNote: event.ticketDesignFooterNote,
        };

        for (const t of createdTickets) {
          this.emailService.sendTicketEmail(confirmEmail, {
            eventTitle: event.title || 'Événement',
            eventDate: event.startDate?.toLocaleDateString('fr-FR') || '',
            venue: event.venueName || '',
            ticketType: ticketType.name,
            orderId: order.id,
            ticketId: t.id,
            qrCode: t.qrCode,
            ticketDesign,
          }).catch(() => {});
        }
      }

      // 🔔 Notification en app uniquement pour les utilisateurs connectés
      if (userId) {
        this.notificationsService.createNotification({
          userId,
          type: 'TICKET_PURCHASED',
          title: '🎫 Billet confirmé !',
          message: `Votre billet pour "${event.title || 'l\'événement'}" est prêt. Bonne fête !`,
          data: { orderId: order.id, eventId },
        }).catch(() => {});
      }
    } else {
      // Paid event: pending payment — notify user that order is pending (connecté seulement)
      if (userId) {
        this.notificationsService.createNotification({
          userId,
          type: 'TICKET_PURCHASED',
          title: '🛒 Commande en attente',
          message: `Votre commande pour "${event.title}" est en attente de paiement.`,
          data: { orderId: order.id, eventId },
        }).catch(() => {});
      }
    }

    return order;
  }

  async findUserOrders(userId: string) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            startDate: true,
            venueName: true,
          },
        },
        OrderItem: {
          include: {
            ticketType: {
              select: {
                id: true,
                name: true,
                price: true,
              },
            },
          },
        },
        tickets: {
          select: {
            id: true,
            qrCode: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Normalize: rename OrderItem → items for frontend consistency
    return orders.map((order) => ({
      ...order,
      items: order.OrderItem,
      OrderItem: undefined,
    }));
  }

  async findOne(id: string, userId: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        event: true,
        tickets: {
          include: {
            ticketType: true,
          },
        },
      },
    });
  }
}
