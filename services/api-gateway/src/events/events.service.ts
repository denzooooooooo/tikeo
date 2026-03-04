import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(page: number = 1, limit: number = 20, filters?: any) {
    const skip = (page - 1) * limit;

    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      startDate: { gte: new Date() },
    };

    if (filters?.category) {
      where.category = filters.category.toUpperCase();
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { venueCity: { contains: filters.search, mode: 'insensitive' } },
        { tags: { has: filters.search.toLowerCase() } },
      ];
    }

    if (filters?.city) {
      where.venueCity = { contains: filters.city, mode: 'insensitive' };
    }

    if (filters?.country) {
      where.venueCountry = { contains: filters.country, mode: 'insensitive' };
    }

    if (filters?.minPrice !== undefined) {
      where.minPrice = { gte: Number(filters.minPrice) };
    }

    if (filters?.maxPrice !== undefined) {
      where.maxPrice = { lte: Number(filters.maxPrice) };
    }

    if (filters?.dateFrom) {
      where.startDate = { ...where.startDate, gte: new Date(filters.dateFrom) };
    }

    if (filters?.dateTo) {
      where.startDate = { ...where.startDate, lte: new Date(filters.dateTo) };
    }

    if (filters?.isFree === 'true') {
      where.minPrice = 0;
    }

    if (filters?.isOnline !== undefined) {
      where.isOnline = filters.isOnline === 'true';
    }

    // Build orderBy — country-first if userCountry provided
    let orderBy: any[] = [{ isFeatured: 'desc' }, { startDate: 'asc' }];

    if (filters?.sortBy === 'popular') {
      orderBy = [{ views: 'desc' }, { ticketsSold: 'desc' }];
    } else if (filters?.sortBy === 'price_asc') {
      orderBy = [{ minPrice: 'asc' }];
    } else if (filters?.sortBy === 'price_desc') {
      orderBy = [{ minPrice: 'desc' }];
    } else if (filters?.sortBy === 'date') {
      orderBy = [{ startDate: 'asc' }];
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        include: {
          organizer: {
            select: {
              id: true,
              companyName: true,
              logo: true,
              verified: true,
            },
          },
          ticketTypes: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 3,
          },
          _count: {
            select: { likes: true, reviews: true },
          },
        },
        orderBy,
      }),
      this.prisma.event.count({ where }),
    ]);

    // If userCountry provided, sort: country-matching events first
    let sortedEvents = events;
    if (filters?.userCountry) {
      const userCountry = filters.userCountry.toLowerCase();
      sortedEvents = [
        ...events.filter((e) =>
          e.venueCountry.toLowerCase().includes(userCountry) ||
          userCountry.includes(e.venueCountry.toLowerCase().split(' ')[0]),
        ),
        ...events.filter(
          (e) =>
            !e.venueCountry.toLowerCase().includes(userCountry) &&
            !userCountry.includes(e.venueCountry.toLowerCase().split(' ')[0]),
        ),
      ];
    }

    // Recalculer minPrice depuis les ticketTypes inclus (données fraîches)
    const mappedEvents = sortedEvents.map((event) => {
      const activeTT = (event.ticketTypes || []).filter((tt: any) => tt.isActive !== false);
      if (activeTT.length > 0) {
        const prices = activeTT.map((tt: any) => tt.price);
        return {
          ...event,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
        };
      }
      return event;
    });

    return {
      data: mappedEvents,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    // Try to get from cache first
    const cacheKey = `event:${id}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            description: true,
            logo: true,
            verified: true,
            rating: true,
          },
        },
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (event) {
      // Cache for 2 minutes
      await this.redis.set(cacheKey, JSON.stringify(event), 120);
      
      // Increment view count
      await this.prisma.event.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }

    return event;
  }

  async findBySlug(slug: string) {
    const cacheKey = `event:slug:${slug}`;
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        organizer: {
          select: {
            id: true,
            userId: true,
            companyName: true,
            description: true,
            logo: true,
            verified: true,
            rating: true,
          },
        },
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
        },
        images: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (event) {
      await this.redis.set(cacheKey, JSON.stringify(event), 300);
      
      await this.prisma.event.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });
    }

    return event;
  }

  async getFeatured(limit: number = 6) {
    const cacheKey = 'events:featured';
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    const events = await this.prisma.event.findMany({
      where: {
        isFeatured: true,
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        startDate: { gte: new Date() },
      },
      take: limit,
      include: {
        organizer: {
          select: {
            id: true,
            companyName: true,
            logo: true,
            verified: true,
          },
        },
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
      },
      orderBy: [
        { views: 'desc' },
        { startDate: 'asc' },
      ],
    });

    await this.redis.set(cacheKey, JSON.stringify(events), 60); // 1 min cache

    return events;
  }

  async getRecommendations(userId?: string, country?: string, limit: number = 10) {
    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      startDate: { gte: new Date() },
    };

    if (country) {
      where.venueCountry = { contains: country, mode: 'insensitive' };
    }

    const events = await this.prisma.event.findMany({
      where,
      take: limit,
      include: {
        organizer: {
          select: { id: true, companyName: true, logo: true, verified: true },
        },
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
        _count: { select: { likes: true } },
      },
      orderBy: [{ views: 'desc' }, { ticketsSold: 'desc' }],
    });

    // If country filter returned few results, fill with global popular events
    if (events.length < limit && country) {
      const remaining = limit - events.length;
      const existingIds = events.map((e) => e.id);
      const globalEvents = await this.prisma.event.findMany({
        where: {
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          startDate: { gte: new Date() },
          id: { notIn: existingIds },
        },
        take: remaining,
        include: {
          organizer: {
            select: { id: true, companyName: true, logo: true, verified: true },
          },
          ticketTypes: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 1,
          },
          _count: { select: { likes: true } },
        },
        orderBy: [{ views: 'desc' }, { ticketsSold: 'desc' }],
      });
      return [...events, ...globalEvents];
    }

    return events;
  }

  async getNearby(country: string, city?: string, limit: number = 12) {
    const where: any = {
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      startDate: { gte: new Date() },
    };

    if (city) {
      where.OR = [
        { venueCity: { contains: city, mode: 'insensitive' } },
        { venueCountry: { contains: country, mode: 'insensitive' } },
      ];
    } else {
      where.venueCountry = { contains: country, mode: 'insensitive' };
    }

    const events = await this.prisma.event.findMany({
      where,
      take: limit,
      include: {
        organizer: {
          select: { id: true, companyName: true, logo: true, verified: true },
        },
        ticketTypes: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1,
        },
        _count: { select: { likes: true } },
      },
      orderBy: [{ isFeatured: 'desc' }, { startDate: 'asc' }],
    });

    // Fill with other African events if not enough
    if (events.length < limit) {
      const remaining = limit - events.length;
      const existingIds = events.map((e) => e.id);
      const otherEvents = await this.prisma.event.findMany({
        where: {
          status: 'PUBLISHED',
          visibility: 'PUBLIC',
          startDate: { gte: new Date() },
          id: { notIn: existingIds },
        },
        take: remaining,
        include: {
          organizer: {
            select: { id: true, companyName: true, logo: true, verified: true },
          },
          ticketTypes: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
            take: 1,
          },
          _count: { select: { likes: true } },
        },
        orderBy: [{ views: 'desc' }, { startDate: 'asc' }],
      });
      return [...events, ...otherEvents];
    }

    return events;
  }

  async findMyEvents(userId: string) {
    const organizer = await this.prisma.organizer.findUnique({ where: { userId } });
    if (!organizer) return [];

    return this.prisma.event.findMany({
      where: { organizerId: organizer.id },
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
        _count: { select: { tickets: true, orders: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: any, userId: string) {
    // Find or auto-create organizer profile for this user
    let organizer = await this.prisma.organizer.findUnique({ where: { userId } });
    if (!organizer) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const name = user
        ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0]
        : 'Mon Organisation';
      organizer = await this.prisma.organizer.create({
        data: { userId, companyName: name, verified: false },
      });
    }

    const slug = dto.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim() + '-' + Date.now();

    // Extract fields not in Prisma schema (isFree) and optional fields with defaults
    const { ticketTypes, isFree: _isFree, capacity: capacityFromDto, ...eventData } = dto;

    // Capacity = explicit value OR sum of all ticket quantities OR default 100
    const totalTicketQty = ticketTypes?.reduce(
      (sum: number, tt: any) => sum + (Number(tt.quantity) || 0), 0
    ) || 0;
    const capacity = capacityFromDto || totalTicketQty || 100;

    const event = await this.prisma.event.create({
      data: {
        ...eventData,
        slug,
        organizerId: organizer.id,
        status: 'DRAFT',
        visibility: 'PUBLIC',
        // Required fields with safe defaults if not provided by frontend
        coverImage: eventData.coverImage || '',
        venuePostalCode: eventData.venuePostalCode || '',
        capacity,
        ticketsAvailable: capacity,
        minPrice: ticketTypes?.[0]?.price ?? 0,
        maxPrice: ticketTypes?.[ticketTypes?.length - 1]?.price ?? 0,
        // Ticket design customization
        ticketDesignTemplate: eventData.ticketDesignTemplate || 'CLASSIC',
        ticketDesignBackgroundUrl: eventData.ticketDesignBackgroundUrl || null,
        ticketDesignPrimaryColor: eventData.ticketDesignPrimaryColor || '#5B7CFF',
        ticketDesignSecondaryColor: eventData.ticketDesignSecondaryColor || '#7B61FF',
        ticketDesignTextColor: eventData.ticketDesignTextColor || '#111827',
        ticketDesignShowQr: eventData.ticketDesignShowQr ?? true,
        ticketDesignShowSeat: eventData.ticketDesignShowSeat ?? true,
        ticketDesignShowTerms: eventData.ticketDesignShowTerms ?? true,
        ticketDesignCustomTitle: eventData.ticketDesignCustomTitle || null,
        ticketDesignFooterNote: eventData.ticketDesignFooterNote || null,
        ticketTypes: ticketTypes?.length
          ? {
              create: ticketTypes.map((tt: any) => ({
                name: tt.name,
                description: tt.description,
                price: tt.price,
                quantity: tt.quantity,
                available: tt.quantity,
                sold: 0,
                salesStart: tt.salesStart ?? new Date(),
                salesEnd: tt.salesEnd ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                minPerOrder: tt.minPerOrder ?? 1,
                maxPerOrder: tt.maxPerOrder ?? 10,
                isActive: true,
                benefits: Array.isArray(tt.benefits)
                  ? (tt.benefits.length > 0 ? JSON.stringify(tt.benefits) : null)
                  : (tt.benefits || null),
              })),
            }
          : undefined,
      },
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
      },
    });

    // Invalidate cache
    await this.redis.del('events:featured');

    return event;
  }

  async update(id: string, dto: any, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const { ticketTypes, ...eventData } = dto;

    // Si la capacité est modifiée, synchroniser ticketsAvailable
    if (eventData.capacity !== undefined) {
      eventData.ticketsAvailable = Number(eventData.capacity);
    }

    // Ticket design defaults/cleanup
    if (eventData.ticketDesignTemplate === '') eventData.ticketDesignTemplate = 'CLASSIC';
    if (eventData.ticketDesignPrimaryColor === '') eventData.ticketDesignPrimaryColor = '#5B7CFF';
    if (eventData.ticketDesignSecondaryColor === '') eventData.ticketDesignSecondaryColor = '#7B61FF';
    if (eventData.ticketDesignTextColor === '') eventData.ticketDesignTextColor = '#111827';

    const updated = await this.prisma.event.update({
      where: { id },
      data: eventData,
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
      },
    });

    // Si la capacité est modifiée, mettre à jour les types de billets
    if (eventData.capacity !== undefined) {
      const newCapacity = Number(eventData.capacity);
      const existingTicketTypes = await this.prisma.ticketType.findMany({
        where: { eventId: id, isActive: true },
      });

      if (existingTicketTypes.length === 1) {
        // Un seul type de billet : on met à jour directement
        const tt = existingTicketTypes[0];
        await this.prisma.ticketType.update({
          where: { id: tt.id },
          data: {
            quantity: newCapacity,
            available: Math.max(0, newCapacity - tt.sold),
          },
        });
      } else if (existingTicketTypes.length > 1) {
        // Plusieurs types : on met à jour chacun proportionnellement
        const totalQty = existingTicketTypes.reduce((s, tt) => s + tt.quantity, 0);
        for (const tt of existingTicketTypes) {
          const ratio = totalQty > 0 ? tt.quantity / totalQty : 1 / existingTicketTypes.length;
          const newQty = Math.round(newCapacity * ratio);
          await this.prisma.ticketType.update({
            where: { id: tt.id },
            data: {
              quantity: newQty,
              available: Math.max(0, newQty - tt.sold),
            },
          });
        }
      }
    }

    // Invalidate cache
    await this.redis.del(`event:${id}`);
    await this.redis.del('events:featured');

    // 🔔 Notify all ticket buyers of the update (fire and forget)
    this.notifyEventAttendees(id, updated.title, 'EVENT_UPDATED',
      `📢 Mise à jour : "${updated.title}"`,
      `L'événement "${updated.title}" a été mis à jour par l'organisateur.`
    ).catch(() => {});

    return updated;
  }

  async remove(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    await this.prisma.event.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await this.redis.del(`event:${id}`);
    await this.redis.del('events:featured');

    // 🔔 Notify all ticket buyers of cancellation (fire and forget)
    this.notifyEventAttendees(id, event.title, 'EVENT_CANCELLED',
      `❌ Événement annulé : "${event.title}"`,
      `L'événement "${event.title}" a été annulé. Vous serez remboursé si applicable.`
    ).catch(() => {});

    return { message: 'Événement annulé avec succès' };
  }

  // ─── TICKET TYPE CRUD ────────────────────────────────────────────────────────

  /**
   * Synchronise minPrice et maxPrice de l'événement depuis ses types de billets actifs.
   * À appeler après chaque création/modification/suppression de ticket type.
   */
  private async syncEventPrices(eventId: string) {
    const ticketTypes = await this.prisma.ticketType.findMany({
      where: { eventId, isActive: true },
      orderBy: { price: 'asc' },
    });

    if (ticketTypes.length === 0) return;

    const prices = ticketTypes.map((tt) => tt.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    await this.prisma.event.update({
      where: { id: eventId },
      data: { minPrice, maxPrice },
    });
  }

  async createTicketType(eventId: string, dto: any, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const now = new Date();
    const ticketType = await this.prisma.ticketType.create({
      data: {
        eventId,
        name: dto.name,
        description: dto.description || null,
        price: Number(dto.price) || 0,
        quantity: Number(dto.quantity) || 0,
        available: Number(dto.quantity) || 0,
        sold: 0,
        maxPerOrder: Number(dto.maxPerOrder) || 10,
        salesStart: dto.salesStart ? new Date(dto.salesStart) : now,
        salesEnd: dto.salesEnd ? new Date(dto.salesEnd) : new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
      },
    });

    // Synchroniser minPrice/maxPrice de l'événement
    await this.syncEventPrices(eventId);
    await this.redis.del(`event:${eventId}`);
    return ticketType;
  }

  async updateTicketType(eventId: string, ttId: string, dto: any, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const existing = await this.prisma.ticketType.findUnique({ where: { id: ttId } });
    if (!existing || existing.eventId !== eventId) throw new Error('Type de billet non trouvé');

    const updated = await this.prisma.ticketType.update({
      where: { id: ttId },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.price !== undefined && { price: Number(dto.price) }),
        ...(dto.quantity !== undefined && {
          quantity: Number(dto.quantity),
          // Adjust available: new quantity - already sold
          available: Math.max(0, Number(dto.quantity) - existing.sold),
        }),
        ...(dto.maxPerOrder !== undefined && { maxPerOrder: Number(dto.maxPerOrder) }),
        ...(dto.salesStart !== undefined && { salesStart: new Date(dto.salesStart) }),
        ...(dto.salesEnd !== undefined && { salesEnd: new Date(dto.salesEnd) }),
      },
    });

    // Synchroniser minPrice/maxPrice de l'événement après modification du prix
    await this.syncEventPrices(eventId);
    await this.redis.del(`event:${eventId}`);
    return updated;
  }

  async deleteTicketType(eventId: string, ttId: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const existing = await this.prisma.ticketType.findUnique({ where: { id: ttId } });
    if (!existing || existing.eventId !== eventId) throw new Error('Type de billet non trouvé');

    // Only allow deletion if no tickets sold yet
    if (existing.sold > 0) {
      throw new Error('Impossible de supprimer un type de billet avec des ventes actives');
    }

    await this.prisma.ticketType.delete({ where: { id: ttId } });

    // Synchroniser minPrice/maxPrice de l'événement après suppression
    await this.syncEventPrices(eventId);
    await this.redis.del(`event:${eventId}`);
    return { message: 'Type de billet supprimé' };
  }

  // ── Helper: notify all confirmed ticket buyers of an event ──────────────────
  private async notifyEventAttendees(
    eventId: string,
    eventTitle: string,
    type: 'EVENT_UPDATED' | 'EVENT_CANCELLED',
    title: string,
    message: string,
  ) {
    // Get all users who have confirmed orders for this event (exclude guest orders)
    const orders = await this.prisma.order.findMany({
      where: { eventId, status: 'CONFIRMED', userId: { not: null } },
      select: { userId: true },
      distinct: ['userId'],
    });
 
    if (orders.length === 0) return;

    // Filter out null userIds (guest orders)
    const notifications = orders
      .filter(o => o.userId != null)
      .map(o => ({
        userId: o.userId as string,
        type: type as any,
        title,
        message,
        data: { eventId },
      }));

    if (notifications.length === 0) return;
    await this.notificationsService.createBulkNotifications(notifications);
  }

  async unpublish(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const unpublished = await this.prisma.event.update({
      where: { id },
      data: { status: 'DRAFT' },
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
      },
    });

    await this.redis.del(`event:${id}`);
    await this.redis.del('events:featured');

    return unpublished;
  }

  async publish(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { organizer: true },
    });
    if (!event) throw new Error('Événement non trouvé');
    if (event.organizer.userId !== userId) throw new Error('Non autorisé');

    const published = await this.prisma.event.update({
      where: { id },
      data: { status: 'PUBLISHED', publishedAt: new Date() },
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
      },
    });

    await this.redis.del(`event:${id}`);
    await this.redis.del('events:featured');

    return published;
  }

  async getCountries() {
    const events = await this.prisma.event.findMany({
      where: { status: 'PUBLISHED', visibility: 'PUBLIC' },
      select: { venueCountry: true },
      distinct: ['venueCountry'],
    });
    return events.map((e) => e.venueCountry).sort();
  }

  // Nouveau endpoint : retourne le nombre d'événements par pays (dynamique - tous les pays avec événements)
  async getCountryCounts(): Promise<Record<string, number>> {
    // Requête pour compter les événements par pays
    const countryCounts = await this.prisma.event.groupBy({
      by: ['venueCountry'],
      where: {
        status: 'PUBLISHED',
        visibility: 'PUBLIC',
        venueCountry: {
          not: '',
        },
      },
      _count: {
        venueCountry: true,
      },
    });

    // Créer un objet avec le compte pour chaque pays
    const counts: Record<string, number> = {};
    
    // Remplir avec les données réelles
    countryCounts.forEach((item) => {
      if (item.venueCountry) {
        counts[item.venueCountry] = item._count.venueCountry;
      }
    });

    return counts;
  }

  async getCities(country?: string) {
    const where: any = { status: 'PUBLISHED', visibility: 'PUBLIC' };
    if (country) {
      where.venueCountry = { contains: country, mode: 'insensitive' };
    }
    const events = await this.prisma.event.findMany({
      where,
      select: { venueCity: true, venueCountry: true },
      distinct: ['venueCity'],
    });
    return events.map((e) => ({ city: e.venueCity, country: e.venueCountry }));
  }

  // ─── ADMIN: delete all seeded events ────────────────────────────────────────
  async deleteAllEvents() {
    await this.prisma.ticket.deleteMany();
    await this.prisma.order.deleteMany();
    await this.prisma.ticketType.deleteMany();
    await this.prisma.eventImage.deleteMany();
    await this.prisma.eventLike.deleteMany();
    await this.prisma.eventReview.deleteMany();
    const result = await this.prisma.event.deleteMany();
    await this.redis.del('events:featured');
    return { deleted: result.count };
  }
}
