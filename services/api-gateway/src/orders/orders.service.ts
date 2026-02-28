import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async createOrder(userId: string, data: {
    eventId: string;
    ticketTypeId: string;
    quantity: number;
    promoCode?: string;
  }) {
    // Verify event exists
    const event = await this.prisma.event.findUnique({ where: { id: data.eventId } });
    if (!event) throw new NotFoundException('Événement non trouvé');

    // Verify ticket type exists and has enough stock
    const ticketType = await this.prisma.ticketType.findUnique({
      where: { id: data.ticketTypeId },
    });
    if (!ticketType) throw new NotFoundException('Type de billet non trouvé');
    if (ticketType.quantity < data.quantity) {
      throw new Error('Stock insuffisant pour ce type de billet');
    }

    const unitPrice = Number(ticketType.price);
    const subtotal = unitPrice * data.quantity;

    // Apply promo code if provided
    let discount = 0;
    let promoCodeId: string | undefined;
    if (data.promoCode) {
      const promo = await this.prisma.promoCode.findFirst({
        where: { code: data.promoCode, isActive: true },
      });
      if (promo) {
        discount = (subtotal * Number(promo.discountPercent)) / 100;
        promoCodeId = promo.id;
      }
    }

    const total = subtotal - discount;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        userId,
        eventId: data.eventId,
        status: 'PENDING',
        total,
        currency: event.currency || 'EUR',
        ...(promoCodeId ? { promoCodeId } : {}),
        OrderItem: {
          create: {
            ticketTypeId: data.ticketTypeId,
            quantity: data.quantity,
            price: unitPrice,
          },
        },
      },
      include: {
        OrderItem: true,
        event: { select: { id: true, title: true, startDate: true } },
      },
    });

    return order;
  }

  async findUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            startDate: true,
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
