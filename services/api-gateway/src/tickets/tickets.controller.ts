import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TicketsService } from './tickets.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(private ticketsService: TicketsService) {}

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

  @Post('validate')
  @ApiOperation({ summary: 'Validate ticket by QR code' })
  @ApiResponse({ status: 200, description: 'Ticket validated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid ticket' })
  async validateTicket(@Body('qrCode') qrCode: string) {
    return this.ticketsService.validateTicket(qrCode);
  }
}
