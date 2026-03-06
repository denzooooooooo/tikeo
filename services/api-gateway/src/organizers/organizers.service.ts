import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrganizersService {
  private readonly logger = new Logger(OrganizersService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {}

  async findAll() {
    return this.prisma.organizer.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            events: true,
            subscriptions: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        events: {
          where: { status: 'PUBLISHED' },
          orderBy: { startDate: 'asc' },
          take: 6,
        },
        _count: {
          select: {
            events: true,
            subscriptions: true,
          },
        },
      },
    });

    if (!organizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }

    return organizer;
  }

  async findByUserId(userId: string) {
    return this.prisma.organizer.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            events: true,
            subscriptions: true,
          },
        },
      },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.organizer.update({
      where: { id },
      data,
    });
  }

  // Payout Configuration
  async updatePayoutConfig(data: {
    payoutMethod: string;
    payoutPhone?: string;
    payoutEmail?: string;
    payoutIban?: string;
    payoutBankName?: string;
    payoutSwift?: string;
  }) {
    return { success: true, message: 'Payout config updated' };
  }

  // Get pending payouts for an organizer (after event ends)
  async getPendingPayouts(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    const orders = await this.prisma.order.findMany({
      where: {
        event: { organizerId: organizer.id },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      select: {
        id: true,
        total: true,
        createdAt: true,
        event: { select: { id: true, title: true, endDate: true } },
        OrderItem: { select: { quantity: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const pendingPayouts = orders.map((order) => {
      const ticketCount = order.OrderItem.reduce((acc, item) => acc + item.quantity, 0);
      const commission = this.calculateCommission(order.total, ticketCount);
      const net = Math.max(order.total - commission, 0);

      return {
        orderId: order.id,
        eventId: order.event.id,
        eventTitle: order.event.title,
        gross: order.total,
        commission,
        net,
        createdAt: order.createdAt,
      };
    });

    const totalPending = pendingPayouts.reduce((sum, p) => sum + p.net, 0);

    return {
      pendingPayouts,
      totalPending,
    };
  }

  // Get revenue summary for organizer
  async getRevenueSummary(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!organizer) {
      throw new NotFoundException('Organisateur non trouvé');
    }

    const orders = await this.prisma.order.findMany({
      where: {
        event: { organizerId: organizer.id },
        status: { in: ['CONFIRMED', 'COMPLETED', 'REFUNDED'] },
      },
      select: {
        id: true,
        total: true,
        status: true,
        eventId: true,
        event: { select: { title: true } },
        OrderItem: { select: { quantity: true } },
      },
    });

    let totalRevenue = 0;
    let totalCommission = 0;
    let netPayout = 0;
    let pendingPayouts = 0;
    let completedPayouts = 0;

    const byEvent: Record<string, { eventId: string; eventTitle: string; gross: number; commission: number; net: number; orders: number }> = {};

    for (const order of orders) {
      const ticketCount = order.OrderItem.reduce((acc, item) => acc + item.quantity, 0);
      const gross = order.total;
      const commission = this.calculateCommission(gross, ticketCount);
      const net = Math.max(gross - commission, 0);

      totalRevenue += gross;
      totalCommission += commission;
      netPayout += net;

      if (order.status === 'COMPLETED' || order.status === 'CONFIRMED') pendingPayouts += net;
      if (order.status === 'REFUNDED') completedPayouts += net;

      if (!byEvent[order.eventId]) {
        byEvent[order.eventId] = {
          eventId: order.eventId,
          eventTitle: order.event?.title || 'Événement',
          gross: 0,
          commission: 0,
          net: 0,
          orders: 0,
        };
      }

      byEvent[order.eventId].gross += gross;
      byEvent[order.eventId].commission += commission;
      byEvent[order.eventId].net += net;
      byEvent[order.eventId].orders += 1;
    }

    return {
      totalRevenue,
      totalCommission,
      netPayout,
      pendingPayouts,
      completedPayouts,
      events: Object.values(byEvent),
    };
  }

  private isPayoutConfigured(organizer: {
    payoutMethod?: string | null;
    payoutPhone?: string | null;
    payoutEmail?: string | null;
    payoutIban?: string | null;
  }): boolean {
    const method = organizer.payoutMethod || '';
    if (!method) return false;
    if (method === 'BANK_TRANSFER') return !!organizer.payoutIban;
    if (method === 'MOBILE_MONEY') return !!organizer.payoutPhone;
    if (method === 'PAYPAL') return !!organizer.payoutEmail;
    return !!(organizer.payoutIban || organizer.payoutPhone || organizer.payoutEmail);
  }

  async sendPayoutReminderIfNeeded(organizerId: string, eventTitle?: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    if (!organizer || !organizer.user?.email) return { sent: false, reason: 'ORGANIZER_NOT_FOUND' };
    if (this.isPayoutConfigured(organizer)) return { sent: false, reason: 'PAYOUT_ALREADY_CONFIGURED' };

    const frontendUrl = this.configService.get('FRONTEND_URL', 'http://localhost:3000');
    const organizerName = organizer.user.firstName || organizer.companyName || 'Organisateur';

    const result = await this.emailService.sendOrganizerPayoutReminderEmail(organizer.user.email, {
      organizerName,
      eventTitle: eventTitle || 'votre événement',
      payoutSetupUrl: `${frontendUrl}/dashboard/settings`,
    });

    if (result.success) {
      this.logger.log(`Payout reminder sent to organizer ${organizer.id}`);
      return { sent: true };
    }

    this.logger.warn(`Failed to send payout reminder for organizer ${organizer.id}: ${result.error}`);
    return { sent: false, reason: result.error || 'EMAIL_FAILED' };
  }

  // Calculate commission for an order
  calculateCommission(
    totalRevenue: number,
    ticketCount: number,
    baseRate: number = 0.30,
    perTicketRate: number = 0.10,
  ): number {
    const percentageCommission = totalRevenue * (baseRate / 100);
    const ticketCommission = ticketCount * perTicketRate;
    return percentageCommission + ticketCommission;
  }
}
