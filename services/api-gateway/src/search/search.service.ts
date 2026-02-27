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
}

