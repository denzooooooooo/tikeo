import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService implements OnModuleInit {
  private stripe: Stripe | null = null;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private redis: RedisService,
    private notificationsService: NotificationsService,
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
    this.checkStripe();
    const paymentIntent = await this.stripe!.paymentIntents.retrieve(paymentIntentId);

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

      if (!order) {
        this.logger.error(`Order not found for payment ${paymentIntentId}`);
        return { success: false, error: 'Order not found' };
      }

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

      const createdTicketsByType = new Map<string, Array<{ id: string; qrCode: string }>>();
      for (const item of order.OrderItem) {
        // ✅ Decrement available count for paid tickets
        await this.prisma.ticketType.update({
          where: { id: item.ticketTypeId },
          data: { available: { decrement: item.quantity }, sold: { increment: item.quantity } },
        });

        const createdTickets: Array<{ id: string; qrCode: string }> = [];
        for (let i = 0; i < item.quantity; i++) {
          const createdTicket = await this.prisma.ticket.create({
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
            select: { id: true, qrCode: true },
          });
          createdTickets.push(createdTicket);
        }
        createdTicketsByType.set(item.ticketTypeId, createdTickets);
      }

      // Send confirmation email (fire and forget)
      // Get user email (logged in) OR guest email
      let confirmEmail: string | null = null;
      let buyerFirstName: string | null = null;
      let buyerLastName: string | null = null;
      let buyerPhone: string | null = null;

      if (order.userId) {
        // Logged in user
        const user = await this.prisma.user.findUnique({
          where: { id: order.userId },
          select: { email: true, firstName: true, lastName: true, phone: true },
        });
        confirmEmail = user?.email || null;
        buyerFirstName = user?.firstName || null;
        buyerLastName = user?.lastName || null;
        buyerPhone = user?.phone || null;
      } else if (order.guestEmail) {
        // Guest (not logged in)
        confirmEmail = order.guestEmail;
        buyerFirstName = order.billingName?.split(' ')?.[0] || null;
        buyerLastName = order.billingName?.split(' ')?.slice(1).join(' ') || null;
        buyerPhone = order.guestPhone || null;
      }

      const event = eventData ?? await this.prisma.event.findUnique({
        where: { id: order.eventId },
        select: {
          title: true,
          startDate: true,
          venueName: true,
          coverImage: true,
          ticketDesignTemplate: true,
          ticketDesignBackgroundUrl: true,
          ticketDesignPrimaryColor: true,
          ticketDesignSecondaryColor: true,
          ticketDesignTextColor: true,
          ticketDesignShowQr: true,
          ticketDesignShowSeat: true,
          ticketDesignShowTerms: true,
          ticketDesignCustomTitle: true,
          ticketDesignFooterNote: true,
        },
      });

      if (confirmEmail && event) {
        try {
          const result = await this.emailService.sendOrderConfirmationEmail(confirmEmail, {
            orderId: order.id,
            total: order.total,
            eventTitle: event.title,
            ticketCount: order.OrderItem.reduce((sum, i) => sum + i.quantity, 0),
          });

          if (result.success) {
            this.logger.log(`Order confirmation email sent successfully to ${confirmEmail} for order ${order.id} (messageId: ${result.messageId})`);
          } else {
            this.logger.error(`Failed to send order confirmation email to ${confirmEmail} for order ${order.id}: ${result.error}`);
          }
        } catch (err) {
          this.logger.error(`Exception sending order confirmation email to ${confirmEmail} for order ${order.id}: ${err}`);
        }

        const ticketDesign = {
          template: (event as any).ticketDesignTemplate,
          backgroundUrl: (event as any).ticketDesignBackgroundUrl,
          primaryColor: (event as any).ticketDesignPrimaryColor,
          secondaryColor: (event as any).ticketDesignSecondaryColor,
          textColor: (event as any).ticketDesignTextColor,
          showQr: (event as any).ticketDesignShowQr,
          showSeat: (event as any).ticketDesignShowSeat,
          showTerms: (event as any).ticketDesignShowTerms,
          customTitle: (event as any).ticketDesignCustomTitle,
          footerNote: (event as any).ticketDesignFooterNote,
        };

        for (const item of order.OrderItem) {
          const itemTicketType = await this.prisma.ticketType.findUnique({
            where: { id: item.ticketTypeId },
            select: { name: true },
          });
          const itemTickets = createdTicketsByType.get(item.ticketTypeId) || [];

          for (const t of itemTickets) {
            try {
              const result = await this.emailService.sendTicketEmail(confirmEmail, {
                eventTitle: event.title,
                eventDate: event.startDate?.toLocaleDateString('fr-FR') || '',
                venue: event.venueName || '',
                ticketType: itemTicketType?.name || 'Billet',
                orderId: order.id,
                ticketId: t.id,
                qrCode: t.qrCode,
                eventCoverImage: (event as any).coverImage || undefined,
                buyerFirstName: buyerFirstName || undefined,
                buyerLastName: buyerLastName || undefined,
                buyerEmail: confirmEmail || undefined,
                buyerPhone: buyerPhone || undefined,
                ticketDesign,
              });

              if (result.success) {
                this.logger.log(`Ticket email sent successfully to ${confirmEmail} for ticket ${t.id} (messageId: ${result.messageId})`);
              } else {
                this.logger.error(`Failed to send ticket email to ${confirmEmail} for ticket ${t.id}: ${result.error}`);
              }
            } catch (err) {
              this.logger.error(`Exception sending ticket email to ${confirmEmail} for ticket ${t.id}: ${err}`);
            }
          }
        }
      }

      // 🔔 Real notification: payment confirmed (connected users only)
      if (order.userId) {
        this.notificationsService.createNotification({
          userId: order.userId,
          type: 'TICKET_PURCHASED',
          title: '🎫 Paiement confirmé !',
          message: `Votre paiement pour "${event?.title || 'l\'événement'}" a été accepté. Vos billets sont prêts !`,
          data: { orderId: order.id, eventId: order.eventId },
        }).catch(() => {});
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

    this.checkStripe();
    const refund = await this.stripe!.refunds.create({
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

    // 🔔 Real notification: refund processed
    const refundedOrderData = await this.prisma.order.findUnique({
      where: { id: payment.orderId },
      select: { userId: true, eventId: true, event: { select: { title: true } } },
    });
    if (refundedOrderData?.userId) {
      this.notificationsService.createNotification({
        userId: refundedOrderData.userId,
        type: 'REFUND_PROCESSED',
        title: '💰 Remboursement effectué',
        message: `Votre remboursement pour "${refundedOrderData.event?.title || 'l\'événement'}" a été traité.`,
        data: { orderId: payment.orderId, eventId: refundedOrderData.eventId },
      }).catch(() => {});
    }

    return { success: true, refund };
  }

  private generateQRCode(): string {
    return `TKT-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  }
}
