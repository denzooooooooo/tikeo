import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

export interface ScanEvent {
  type: 'VALID' | 'ALREADY_SCANNED' | 'INVALID' | 'UNAUTHORIZED';
  qrCode: string;
  ticketId?: string;
  userName?: string;
  eventTitle?: string;
  scannedAt?: Date;
  scannedByUserId?: string;
  timestamp: Date;
}

@Injectable()
export class TicketsService {
  // Global SSE subject — emits scan events to all connected organizers
  private readonly scanEventSubject = new Subject<ScanEvent>();
  public readonly scanEvents$ = this.scanEventSubject.asObservable();

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
            ticketDesignTemplate: true,
            ticketDesignBackgroundUrl: true,
            ticketDesignPrimaryColor: true,
            ticketDesignSecondaryColor: true,
            ticketDesignTextColor: true,
            ticketDesignCustomTitle: true,
            ticketDesignFooterNote: true,
            ticketDesignShowQr: true,
            ticketDesignShowSeat: true,
            ticketDesignShowTerms: true,
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
      where: { id, userId },
      include: {
        event: true,
        ticketType: true,
        order: true,
      },
    });
  }

  /**
   * Validate a ticket by QR code.
   * - userId / userRole: the authenticated organizer/admin performing the scan
   * - ADMIN can validate any ticket
   * - ORGANIZER can only validate tickets belonging to their own events
   */
  async validateTicket(qrCode: string, userId: string, userRole: string) {
    const normalizedQr = (qrCode || '').trim();

    if (!normalizedQr) {
      this.scanEventSubject.next({
        type: 'INVALID',
        qrCode: normalizedQr,
        scannedByUserId: userId,
        timestamp: new Date(),
      });
      return { valid: false, message: 'QR code is required' };
    }

    if (!normalizedQr.startsWith('TKT-')) {
      this.scanEventSubject.next({
        type: 'INVALID',
        qrCode: normalizedQr,
        scannedByUserId: userId,
        timestamp: new Date(),
      });
      return { valid: false, message: 'Invalid QR code format' };
    }

    // 1. Find ticket with full event + organizer info
    const ticket = await this.prisma.ticket.findUnique({
      where: { qrCode: normalizedQr },
      include: {
        event: {
          include: {
            organizer: {
              select: { userId: true },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        ticketType: {
          select: { name: true },
        },
      },
    });

    if (!ticket) {
      this.scanEventSubject.next({
        type: 'INVALID',
        qrCode: normalizedQr,
        scannedByUserId: userId,
        timestamp: new Date(),
      });
      return { valid: false, message: 'Ticket not found' };
    }

    // 2. Ownership check — ORGANIZER can only scan their own events
    if (userRole !== 'ADMIN') {
      if (userRole !== 'ORGANIZER') {
        this.scanEventSubject.next({
          type: 'UNAUTHORIZED',
          qrCode: normalizedQr,
          scannedByUserId: userId,
          timestamp: new Date(),
        });
        return { valid: false, message: 'Unauthorized: only organizers can validate tickets' };
      }
      if (ticket.event.organizer.userId !== userId) {
        this.scanEventSubject.next({
          type: 'UNAUTHORIZED',
          qrCode: normalizedQr,
          ticketId: ticket.id,
          eventTitle: ticket.event.title,
          scannedByUserId: userId,
          timestamp: new Date(),
        });
        return {
          valid: false,
          message: 'Unauthorized: this ticket does not belong to your event',
        };
      }
    }

    // 3. Status check
    if (ticket.status !== 'VALID') {
      this.scanEventSubject.next({
        type: 'INVALID',
        qrCode: normalizedQr,
        ticketId: ticket.id,
        userName: `${ticket.user.firstName} ${ticket.user.lastName}`,
        eventTitle: ticket.event.title,
        scannedByUserId: userId,
        timestamp: new Date(),
      });
      return { valid: false, message: `Ticket is ${ticket.status.toLowerCase()}` };
    }

    // 4. Already scanned check
    if (ticket.scannedAt) {
      this.scanEventSubject.next({
        type: 'ALREADY_SCANNED',
        qrCode: normalizedQr,
        ticketId: ticket.id,
        userName: `${ticket.user.firstName} ${ticket.user.lastName}`,
        eventTitle: ticket.event.title,
        scannedAt: ticket.scannedAt,
        scannedByUserId: userId,
        timestamp: new Date(),
      });
      return {
        valid: false,
        message: 'Ticket already scanned',
        scannedAt: ticket.scannedAt,
        ticket: {
          id: ticket.id,
          qrCode: ticket.qrCode,
          status: ticket.status,
          event: ticket.event,
          user: ticket.user,
          ticketType: ticket.ticketType,
        },
      };
    }

    // 5. Mark ticket as USED and record who scanned it
    await this.prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        status: 'USED',
        scannedAt: new Date(),
        scannedBy: userId,
      },
    });

    this.scanEventSubject.next({
      type: 'VALID',
      qrCode: normalizedQr,
      ticketId: ticket.id,
      userName: `${ticket.user.firstName} ${ticket.user.lastName}`,
      eventTitle: ticket.event.title,
      scannedByUserId: userId,
      timestamp: new Date(),
    });

    return {
      valid: true,
      message: 'Ticket validated successfully',
      ticket: {
        id: ticket.id,
        qrCode: ticket.qrCode,
        status: 'USED',
        event: ticket.event,
        user: ticket.user,
        ticketType: ticket.ticketType,
      },
    };
  }
}
