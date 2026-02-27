import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findUserTickets(userId: string) {
    return this.prisma.ticket.findMany({
      where: { userId },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            startDate: true,
            venueName: true,
            venueCity: true,
          },
        },
        ticketType: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        purchaseDate: 'desc',
      },
    });
  }

  async findOne(id: string, userId: string) {
    return this.prisma.ticket.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        event: true,
        ticketType: true,
        order: true,
      },
    });
  }

  async validateTicket(qrCode: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode },
      include: {
        event: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!ticket) {
      return { valid: false, message: 'Ticket not found' };
    }

    if (ticket.status !== 'VALID') {
      return { valid: false, message: `Ticket is ${ticket.status.toLowerCase()}` };
    }

    if (ticket.scannedAt) {
      return {
        valid: false,
        message: 'Ticket already scanned',
        scannedAt: ticket.scannedAt,
      };
    }

    // Mark ticket as used
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'USED',
        scannedAt: new Date(),
      },
    });

    return {
      valid: true,
      ticket,
      message: 'Ticket validated successfully',
    };
  }
}
