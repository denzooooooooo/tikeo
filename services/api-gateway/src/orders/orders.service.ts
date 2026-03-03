import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';

export interface CreateOrderDto {
  eventId: string;
  ticketTypeId: string;
  quantity: number;
  promoCode?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private redis: RedisService,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const { eventId, ticketTypeId, quantity, promoCode } = dto;

    // Verify event exists
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new NotFoundException('Événement non trouvé');

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

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
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
      },
      include: {
        OrderItem: true,
        event: {
          select: { id: true, title: true },
        },
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

      for (let i = 0; i < quantity; i++) {
        await this.prisma.ticket.create({
          data: {
            orderId: order.id,
            eventId,
            userId,
            ticketTypeId,
            qrCode: `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`,
            status: 'VALID',
            purchaseDate: new Date(),
            price: 0,
            fees: 0,
            total: 0,
          } as any,
        });
      }

      // Get user email for confirmation
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { email: true, firstName: true },
      });

      if (user) {
        // Send order confirmation email (fire and forget)
        this.emailService.sendOrderConfirmationEmail(user.email, {
          orderId: order.id,
          total: 0,
          eventTitle: order.event?.title || 'Événement',
          ticketCount: quantity,
        }).catch(() => {});

        // Send ticket email
        this.emailService.sendTicketEmail(user.email, {
          eventTitle: order.event?.title || 'Événement',
          eventDate: event.startDate?.toLocaleDateString('fr-FR') || '',
          venue: event.venueName || '',
          ticketType: ticketType.name,
          orderId: order.id,
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
