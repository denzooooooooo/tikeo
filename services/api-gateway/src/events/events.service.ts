import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
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

    return {
      data: sortedEvents,
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
      // Cache for 5 minutes
      await this.redis.set(cacheKey, JSON.stringify(event), 300);
      
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

    await this.redis.set(cacheKey, JSON.stringify(events), 600);

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
    const capacity = capacityFromDto || 100;

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
                benefits: tt.benefits ?? [],
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

    const updated = await this.prisma.event.update({
      where: { id },
      data: eventData,
      include: {
        organizer: { select: { id: true, companyName: true, logo: true, verified: true } },
        ticketTypes: true,
      },
    });

    // Invalidate cache
    await this.redis.del(`event:${id}`);
    await this.redis.del('events:featured');

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

    return { message: 'Événement annulé avec succès' };
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
