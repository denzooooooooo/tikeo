import { Controller, Get, Param, Post, Body, UseGuards, Req, Sse, MessageEvent } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Observable, map } from 'rxjs';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

  // GET /tickets/my-tickets — Get current user's tickets
  @Get('my-tickets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async getMyTickets(@Req() req: any) {
    return this.ticketsService.findUserTickets(req.user.id);
  }

  @Get('user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user tickets' })
  @ApiResponse({ status: 200, description: 'Tickets retrieved successfully' })
  async getUserTickets(@Param('userId') userId: string) {
    return this.ticketsService.findUserTickets(userId);
  }

  @Get(':id/user/:userId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200, description: 'Ticket retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  async getTicket(@Param('id') id: string, @Param('userId') userId: string) {
    return this.ticketsService.findOne(id, userId);
  }

  /**
   * POST /tickets/validate
   * Protected: only ORGANIZER or ADMIN can validate tickets.
   * Organizers can only validate tickets for their own events.
   */
  @Post('validate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validate ticket by QR code (organizer/admin only)' })
  @ApiResponse({ status: 200, description: 'Ticket validated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden — not your event' })
  async validateTicket(@Body('qrCode') qrCode: string, @Req() req: any) {
    return this.ticketsService.validateTicket(qrCode, req.user.id, req.user.role);
  }

  /**
   * GET /tickets/scan-events  (SSE)
   * Real-time stream of scan events for the connected organizer.
   * Uses fetch + ReadableStream on the frontend (supports Authorization header).
   */
  @Sse('scan-events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'SSE stream of real-time scan events' })
  scanEvents(): Observable<MessageEvent> {
    return this.ticketsService.scanEvents$.pipe(
      map((event) => ({ data: event } as MessageEvent)),
    );
  }
}
