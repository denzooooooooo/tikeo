import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrganizersService {
  constructor(private prisma: PrismaService) {}

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
  async getPendingPayouts() {
    return {
      pendingPayouts: [],
      totalPending: 0,
    };
  }

  // Get revenue summary for organizer
  async getRevenueSummary() {
    return {
      totalRevenue: 0,
      totalCommission: 0,
      netPayout: 0,
      pendingPayouts: 0,
      completedPayouts: 0,
      events: [],
    };
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
