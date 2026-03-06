import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // ========== STATS & OVERVIEW ==========
  
  async getDashboardStats() {
    const [
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      totalOrders,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.organizer.count(),
      this.prisma.event.count({ where: { status: 'PUBLISHED' } }),
      this.prisma.ticket.count(),
      this.prisma.order.count({ where: { status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    ]);

    // Calculate total revenue
    const orders = await this.prisma.order.findMany({
      where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
      select: { total: true },
    });
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const adminCommission = totalRevenue * 0.01; // 1%
    const netToOrganizers = totalRevenue * 0.99; // 99%

    return {
      totalUsers,
      totalOrganizers,
      totalEvents,
      totalTicketsSold,
      totalOrders,
      totalRevenue,
      adminCommission,
      netToOrganizers,
    };
  }

  // ========== USERS MANAGEMENT ==========

  async getUsers(page = 1, limit = 20, search?: string, role?: string) {
    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          role: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
              tickets: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { event: { select: { title: true } } },
        },
        tickets: { take: 10, include: { event: { select: { title: true } } } },
        organizer: true,
      },
    });

    if (!user) throw new NotFoundException('Utilisateur non trouvé');
    return user;
  }

  async updateUserRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    });
  }

  // ========== EVENTS MANAGEMENT ==========

  async getEvents(page = 1, limit = 20, status?: string, search?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organizer: {
            select: { id: true, companyName: true, user: { select: { email: true } } },
          },
          _count: { select: { tickets: true, orders: true } },
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      events,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { include: { user: { select: { email: true, firstName: true, lastName: true } } } },
        ticketTypes: true,
        _count: { select: { tickets: true, orders: true } },
      },
    });

    if (!event) throw new NotFoundException('Événement non trouvé');
    return event;
  }

  // ========== TICKETS MANAGEMENT ==========

  async getTickets(page = 1, limit = 20, eventId?: string, status?: string) {
    const where: any = {};

    if (eventId) where.eventId = eventId;
    if (status) where.status = status;

    const [tickets, total] = await Promise.all([
      this.prisma.ticket.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          event: { select: { title: true } },
          user: { select: { email: true, firstName: true, lastName: true } },
          ticketType: { select: { name: true } },
        },
      }),
      this.prisma.ticket.count({ where }),
    ]);

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // ========== ORGANIZERS & PAYOUTS (CRUCIAL) ==========

  async getOrganizersWithPayouts() {
    const organizers = await this.prisma.organizer.findMany({
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        events: {
          where: { status: 'PUBLISHED' },
          select: { id: true, title: true, ticketsSold: true },
        },
        _count: { select: { events: true } },
      },
    });

    const result = [];

    for (const org of organizers) {
      // Get all orders for this organizer's events
      const orders = await this.prisma.order.findMany({
        where: {
          event: { organizerId: org.id },
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
        select: { total: true },
      });

      const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const commission = grossRevenue * 0.01; // 1%
      const netPayout = grossRevenue * 0.99; // 99%

      // Get already paid payouts
      const paidPayouts = await this.prisma.payoutRecord.findMany({
        where: {
          organizerId: org.id,
          status: 'COMPLETED',
        },
        select: { netAmount: true },
      });

      const alreadyPaid = paidPayouts.reduce((sum, p) => sum + p.netAmount, 0);
      const pendingPayout = netPayout - alreadyPaid;

      // Get payout config status
      const isPayoutConfigured = !!(org.payoutIban || org.payoutPhone || org.payoutEmail);

      result.push({
        id: org.id,
        companyName: org.companyName,
        user: org.user,
        totalEvents: org._count.events,
        grossRevenue,
        commission, // Admin's 1%
        netPayout, // Organizer's 99%
        alreadyPaid,
        pendingPayout: Math.max(0, pendingPayout),
        isPayoutConfigured,
        payoutMethod: org.payoutMethod,
        payoutStatus: org.payoutStatus,
      });
    }

    return result;
  }

  async createPayoutRequest(organizerId: string, adminId: string, method: string, reference?: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
      },
    });

    if (!organizer) throw new NotFoundException('Organisateur non trouvé');

    // Calculate amount due
    const orders = await this.prisma.order.findMany({
      where: {
        event: { organizerId },
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      select: { total: true },
    });

    const grossRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const commission = grossRevenue * 0.01;
    const netAmount = grossRevenue * 0.99;

    // Get already paid
    const paidPayouts = await this.prisma.payoutRecord.findMany({
      where: { organizerId, status: 'COMPLETED' },
      select: { netAmount: true },
    });
    const alreadyPaid = paidPayouts.reduce((sum, p) => sum + p.netAmount, 0);

    const pendingAmount = netAmount - alreadyPaid;

    if (pendingAmount <= 0) {
      throw new Error('Aucun montant en attente de paiement');
    }

    // Create payout record
    const payout = await this.prisma.payoutRecord.create({
      data: {
        organizerId,
        grossAmount: pendingAmount * 1.01, // Approximate gross
        commissionAmount: pendingAmount * 0.0101, // Approximate commission
        netAmount: pendingAmount,
        status: 'COMPLETED',
        method,
        reference,
        processedAt: new Date(),
      },
    });

    // Log admin action
    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'CREATE_PAYOUT',
        entity: 'PayoutRecord',
        entityId: payout.id,
        newValue: JSON.stringify({ organizerId, amount: pendingAmount, method }),
      },
    });

    return payout;
  }

  async getPayoutHistory(organizerId?: string) {
    const where = organizerId ? { organizerId } : {};
    
    return this.prisma.payoutRecord.findMany({
      where,
      orderBy: { processedAt: 'desc' },
      include: {
        organizer: {
          include: { user: { select: { email: true, firstName: true, lastName: true } } },
        },
      },
    });
  }

  // ========== AUDIT LOGS ==========

  async getAuditLogs(page = 1, limit = 50, adminId?: string, entity?: string) {
    const where: any = {};
    
    if (adminId) where.adminId = adminId;
    if (entity) where.entity = entity;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async logAdminAction(adminId: string, action: string, entity: string, entityId?: string, oldValue?: any, newValue?: any) {
    return this.prisma.auditLog.create({
      data: {
        adminId,
        action,
        entity,
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null,
      },
    });
  }

  // ========== REVENUE STATS ==========

  async getRevenueStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
    }

    const orders = await this.prisma.order.findMany({
      where: {
        status: { in: ['CONFIRMED', 'COMPLETED'] },
        createdAt: { gte: startDate },
      },
      select: { total: true, createdAt: true },
    });

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const adminCommission = totalRevenue * 0.01;
    const netToOrganizers = totalRevenue * 0.99;

    // Group by date for chart
    const byDate: Record<string, number> = {};
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      byDate[dateKey] = (byDate[dateKey] || 0) + order.total;
    }

    return {
      period,
      totalRevenue,
      adminCommission,
      netToOrganizers,
      orderCount: orders.length,
      byDate,
    };
  }

  // ========== RECENT ORDERS ==========

  async getRecentOrders(limit = 10) {
    return this.prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { email: true, firstName: true, lastName: true, avatar: true } },
        event: { select: { title: true, coverImage: true } },
      },
    });
  }

  // ========== TOP EVENTS ==========

  async getTopEvents(limit = 10) {
    const events = await this.prisma.event.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        organizer: { select: { companyName: true } },
        _count: { select: { tickets: true, orders: true } },
        orders: {
          where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
          select: { total: true },
        },
      },
    });

    return events
      .map((event) => ({
        id: event.id,
        title: event.title,
        coverImage: event.coverImage,
        organizer: event.organizer.companyName,
        ticketsSold: event._count.tickets,
        ordersCount: event._count.orders,
        revenue: event.orders.reduce((sum, o) => sum + o.total, 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  }

  // ========== TOP ORGANIZERS ==========

  async getTopOrganizers(limit = 10) {
    const organizers = await this.prisma.organizer.findMany({
      include: {
        user: { select: { email: true, firstName: true, lastName: true } },
        _count: { select: { events: true } },
        events: {
          where: { status: 'PUBLISHED' },
          include: {
            orders: {
              where: { status: { in: ['CONFIRMED', 'COMPLETED'] } },
              select: { total: true },
            },
          },
        },
      },
    });

    return organizers
      .map((org) => ({
        id: org.id,
        companyName: org.companyName,
        logo: org.logo,
        user: org.user,
        eventsCount: org._count.events,
        totalRevenue: org.events.reduce((sum, e) => sum + e.orders.reduce((s, o) => s + o.total, 0), 0),
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  }

  // ========== PLATFORM HEALTH ==========

  async getPlatformHealth() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Orders in different periods
    const [orders24h, orders7d, orders30d] = await Promise.all([
      this.prisma.order.count({ where: { createdAt: { gte: last24h }, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
      this.prisma.order.count({ where: { createdAt: { gte: last7d }, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
      this.prisma.order.count({ where: { createdAt: { gte: last30d }, status: { in: ['CONFIRMED', 'COMPLETED'] } } }),
    ]);

    // Users in different periods
    const [users24h, users7d, users30d] = await Promise.all([
      this.prisma.user.count({ where: { createdAt: { gte: last24h } } }),
      this.prisma.user.count({ where: { createdAt: { gte: last7d } } }),
      this.prisma.user.count({ where: { createdAt: { gte: last30d } } }),
    ]);

    // Events published
    const [events24h, events7d, events30d] = await Promise.all([
      this.prisma.event.count({ where: { createdAt: { gte: last24h }, status: 'PUBLISHED' } }),
      this.prisma.event.count({ where: { createdAt: { gte: last7d }, status: 'PUBLISHED' } }),
      this.prisma.event.count({ where: { createdAt: { gte: last30d }, status: 'PUBLISHED' } }),
    ]);

    return {
      orders: { last24h: orders24h, last7d: orders7d, last30d: orders30d },
      users: { last24h: users24h, last7d: users7d, last30d: users30d },
      events: { last24h: events24h, last7d: events7d, last30d: events30d },
      timestamp: now.toISOString(),
    };
  }

  // ========== CATEGORY STATS ==========

  async getCategoryStats() {
    const categories = ['CONCERT', 'FESTIVAL', 'SPECTACLE', 'SPORT', 'CONFERENCE', 'EXHIBITION', 'GASTRONOMIE', 'FAMILLE'];
    
    const stats = await Promise.all(
      categories.map(async (category) => {
        const count = await this.prisma.event.count({
          where: { category, status: 'PUBLISHED' },
        });
        return { category, count };
      })
    );

    return stats.filter(s => s.count > 0);
  }

  // ========== ADMIN MANAGEMENT ==========

  async getAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async createAdmin(email: string, adminId: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: { role: 'ADMIN' },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'CREATE_ADMIN',
        entity: 'User',
        entityId: user.id,
        newValue: JSON.stringify({ email, role: 'ADMIN' }),
      },
    });

    return updated;
  }

  async removeAdmin(userId: string, adminId: string) {
    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' },
    });

    await this.prisma.auditLog.create({
      data: {
        adminId,
        action: 'REMOVE_ADMIN',
        entity: 'User',
        entityId: userId,
        oldValue: JSON.stringify({ role: 'ADMIN' }),
      },
    });

    return updated;
  }
}

