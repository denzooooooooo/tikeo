import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getDashboardStats(organizerId: string) {
    const cacheKey = `dashboard:stats:${organizerId}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const [totalRevenue, ticketsSold, activeEvents, orders] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          order: {
            event: {
              organizerId,
            },
          },
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
      this.prisma.ticket.count({
        where: {
          event: {
            organizerId,
          },
          status: 'VALID',
        },
      }),
      this.prisma.event.count({
        where: {
          organizerId,
          status: 'PUBLISHED',
          startDate: {
            gte: new Date(),
          },
        },
      }),
      this.prisma.order.findMany({
        where: {
          event: {
            organizerId,
          },
        },
        select: {
          status: true,
        },
      }),
    ]);

    const completedOrders = orders.filter((o) => o.status === 'CONFIRMED').length;
    const conversionRate =
      orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : '0';

    const stats = {
      totalRevenue: totalRevenue._sum.amount || 0,
      ticketsSold,
      activeEvents,
      conversionRate: parseFloat(conversionRate),
    };

    await this.redis.set(cacheKey, JSON.stringify(stats), 300);

    return stats;
  }

  async getRevenueChart(organizerId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const payments = await this.prisma.payment.findMany({
      where: {
        order: {
          event: {
            organizerId,
          },
        },
        status: 'COMPLETED',
        paidAt: {
          gte: startDate,
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
      orderBy: {
        paidAt: 'asc',
      },
    });

    const chartData = payments.reduce((acc: any[], payment) => {
      const date = payment.paidAt?.toISOString().split('T')[0];
      const existing = acc.find((item) => item.date === date);

      if (existing) {
        existing.revenue += payment.amount;
      } else {
        acc.push({
          date,
          revenue: payment.amount,
        });
      }

      return acc;
    }, []);

    return chartData;
  }

  async getSalesByEvent(organizerId: string) {
    const events = await this.prisma.event.findMany({
      where: {
        organizerId,
      },
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            tickets: true,
          },
        },
      },
      orderBy: {
        tickets: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    return events.map((event) => ({
      eventId: event.id,
      eventName: event.title,
      ticketsSold: event._count.tickets,
    }));
  }

  async getEventPerformance(eventId: string) {
    const [event, tickets, orders, payments] = await Promise.all([
      this.prisma.event.findUnique({
        where: { id: eventId },
        include: {
          ticketTypes: true,
        },
      }),
      this.prisma.ticket.groupBy({
        by: ['status'],
        where: { eventId },
        _count: true,
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        where: { eventId },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          order: {
            eventId,
          },
          status: 'COMPLETED',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return {
      event,
      ticketStats: tickets,
      orderStats: orders,
      totalRevenue: payments._sum.amount || 0,
    };
  }

  async getTopEvents(organizerId: string, limit: number = 5) {
    const events = await this.prisma.event.findMany({
      where: {
        organizerId,
      },
      select: {
        id: true,
        title: true,
        startDate: true,
        _count: {
          select: {
            tickets: true,
          },
        },
        orders: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            totalAmount: true,
          },
        },
      },
      orderBy: {
        tickets: {
          _count: 'desc',
        },
      },
      take: limit,
    });

    return events.map((event) => ({
      id: event.id,
      title: event.title,
      startDate: event.startDate,
      ticketsSold: event._count.tickets,
      revenue: event.orders.reduce((sum, order) => sum + order.totalAmount, 0),
    }));
  }
}
