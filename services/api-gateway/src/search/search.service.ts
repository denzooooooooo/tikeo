import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async searchEvents(query: string) {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { venueCity: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async searchOrganizers(query: string) {
    return this.prisma.organizer.findMany({
      where: {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async globalSearch(query: string) {
    const [events, organizers] = await Promise.all([
      this.searchEvents(query),
      this.searchOrganizers(query),
    ]);

    return {
      events,
      organizers,
    };
  }

  // Unified search method used by the controller
  async search(query: string, type: string = 'all', limit: number = 10) {
    if (type === 'events') {
      return { events: await this.searchEvents(query), organizers: [] };
    }
    if (type === 'organizers') {
      return { events: [], organizers: await this.searchOrganizers(query) };
    }
    // 'all' or anything else
    const [events, organizers] = await Promise.all([
      this.prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { venueCity: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      this.prisma.organizer.findMany({
        where: {
          OR: [
            { companyName: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
    ]);
    return { events, organizers };
  }

  // Auto-complete suggestions
  async getSuggestions(query: string) {
    if (!query || query.length < 2) return [];
    
    const events = await this.prisma.event.findMany({
      where: {
        title: { contains: query, mode: 'insensitive' },
      },
      select: { title: true, venueCity: true, venueCountry: true },
      take: 5,
    });

    const organizers = await this.prisma.organizer.findMany({
      where: {
        companyName: { contains: query, mode: 'insensitive' },
      },
      select: { companyName: true },
      take: 5,
    });

    return {
      events: events.map(e => ({ type: 'event', text: e.title, city: e.venueCity })),
      organizers: organizers.map(o => ({ type: 'organizer', text: o.companyName })),
    };
  }
}

