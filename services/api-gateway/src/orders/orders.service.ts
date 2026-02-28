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
    if (ticketType.available < data.quantity) {
      throw new Error('Stock insuffisant pour ce type de billet');
    }

    const unitPrice = Number(ticketType.price);
    const subtotal = unitPrice * data.quantity;

    // Apply promo code if provided
    let discountAmount = 0;
    let promoCodeUsed: string | undefined;
    if (data.promoCode) {
      const promo = await this.prisma.promoCode.findFirst({
        where: { code: data.promoCode, isActive: true },
      });
      if (promo) {
        if (promo.discountType === 'PERCENTAGE') {
          discountAmount = (subtotal * Number(promo.discountValue)) / 100;
        } else {
          discountAmount = Number(promo.discountValue);
        }
        promoCodeUsed = promo.code;
      }
    }

    const total = Math.max(0, subtotal - discountAmount);

    // Create order (scalar IDs only — unchecked input)
    const order = await this.prisma.order.create({
      data: {
        userId,
        eventId: data.eventId,
        status: 'PENDING',
        subtotal,
        fees: 0,
        taxes: 0,
        discount: discountAmount,
        promoCodeUsed: promoCodeUsed ?? null,
        total,
        currency: event.currency || 'EUR',
        paymentMethod: 'CARD',
      },
    });

    // Create order item separately to avoid Prisma XOR type conflict
    await this.prisma.orderItem.create({
      data: {
        orderId: order.id,
        ticketTypeId: data.ticketTypeId,
        quantity: data.quantity,
        price: unitPrice,
      },
    });

    // Return order with relations
    return this.prisma.order.findUnique({
      where: { id: order.id },
      include: {
        OrderItem: true,
        event: { select: { id: true, title: true, startDate: true } },
      },
    });
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
