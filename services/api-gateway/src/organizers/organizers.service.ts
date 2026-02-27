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
          },
        },
        events: true,
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
}

