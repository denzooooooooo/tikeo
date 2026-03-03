import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private stripe: Stripe | null = null;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private redis: RedisService,
  ) {}

  async onModuleInit() {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    if (!stripeKey) {
      this.logger.warn('⚠️ STRIPE_SECRET_KEY not configured - Payments service will run in demo mode');
      this.stripe = null;
    } else {
      this.stripe = new Stripe(stripeKey);
      this.logger.log('✅ Stripe initialized');
    }
  }

  private checkStripe() {
    if (!this.stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
  }

  async createPaymentIntent(orderId: string, amount: number) {
    this.checkStripe();
    const paymentIntent = await this.stripe!.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'eur',
      metadata: {
        orderId,
      },
    });

    await this.prisma.payment.create({
      data: {
        orderId,
        amount,
        currency: 'EUR',
        status: 'PENDING',
        stripePaymentIntentId: paymentIntent.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  }

  async confirmPayment(paymentIntentId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    const payment = await this.prisma.payment.findFirst({
      where: { stripePaymentIntentId: paymentIntentId },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (paymentIntent.status === 'succeeded') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          paidAt: new Date(),
        },
      });

      // Update order status
      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'CONFIRMED' },
      });

      // Generate tickets
      const order = await this.prisma.order.findUnique({
        where: { id: payment.orderId },
        include: { OrderItem: true },
      });

      if (order) {
        // ✅ Update event stats + invalidate Redis cache
        const eventData = await this.prisma.event.findUnique({
          where: { id: order.eventId },
          select: { slug: true, title: true, startDate: true, venueName: true },
        });
        const totalQty = order.OrderItem.reduce((s, i) => s + i.quantity, 0);
        await this.prisma.event.update({
          where: { id: order.eventId },
          data: {
            ticketsAvailable: { decrement: totalQty },
            ticketsSold: { increment: totalQty },
          },
        });
        if (eventData) {
          await this.redis.del(`event:${order.eventId}`);
          await this.redis.del(`event:slug:${eventData.slug}`);
        }

        for (const item of order.OrderItem) {
          // ✅ Decrement available count for paid tickets
          await this.prisma.ticketType.update({
            where: { id: item.ticketTypeId },
            data: { available: { decrement: item.quantity }, sold: { increment: item.quantity } },
          });

          for (let i = 0; i < item.quantity; i++) {
            await this.prisma.ticket.create({
              data: {
                orderId: order.id,
                eventId: order.eventId,
                userId: order.userId,
                ticketTypeId: item.ticketTypeId,
                qrCode: this.generateQRCode(),
                status: 'VALID',
                purchaseDate: new Date(),
                price: item.price,
                fees: 0,
                total: item.price,
              } as any,
            });
          }
        }

        // Send confirmation email (fire and forget)
        const user = await this.prisma.user.findUnique({
          where: { id: order.userId },
          select: { email: true },
        });
        const event = eventData ?? await this.prisma.event.findUnique({
          where: { id: order.eventId },
          select: { title: true, startDate: true, venueName: true },
        });
        const ticketType = order.OrderItem[0]
          ? await this.prisma.ticketType.findUnique({
              where: { id: order.OrderItem[0].ticketTypeId },
              select: { name: true },
            })
          : null;

        if (user && event) {
          this.emailService.sendOrderConfirmationEmail(user.email, {
            orderId: order.id,
            total: order.total,
            eventTitle: event.title,
            ticketCount: order.OrderItem.reduce((sum, i) => sum + i.quantity, 0),
          }).catch(() => {});

          if (ticketType) {
            this.emailService.sendTicketEmail(user.email, {
              eventTitle: event.title,
              eventDate: event.startDate?.toLocaleDateString('fr-FR') || '',
              venue: event.venueName || '',
              ticketType: ticketType.name,
              orderId: order.id,
            }).catch(() => {});
          }
        }
      }

      return { success: true, payment };
    }

    return { success: false, status: paymentIntent.status };
  }

  async refundPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || !payment.stripePaymentIntentId) {
      throw new Error('Payment not found');
    }

    const refund = await this.stripe.refunds.create({
      payment_intent: payment.stripePaymentIntentId,
    });

    await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'REFUNDED' },
    });

    // Invalidate tickets
    await this.prisma.ticket.updateMany({
      where: { orderId: payment.orderId },
      data: { status: 'CANCELLED' },
    });

    // ✅ Restore available count on refund
    const refundedOrder = await this.prisma.order.findUnique({
      where: { id: payment.orderId },
      include: { OrderItem: true },
    });
    if (refundedOrder) {
      for (const item of refundedOrder.OrderItem) {
        await this.prisma.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { available: { increment: item.quantity } },
        });
      }
    }

    return { success: true, refund };
  }

  private generateQRCode(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
