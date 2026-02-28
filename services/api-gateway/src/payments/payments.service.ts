import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    });
  }

  async createPaymentIntent(orderId: string, amount: number) {
    const paymentIntent = await this.stripe.paymentIntents.create({
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
        include: { items: true },
      });

      if (order) {
        for (const item of order.items) {
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
              },
            });
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

    return { success: true, refund };
  }

  private generateQRCode(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
