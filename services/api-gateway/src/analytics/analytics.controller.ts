import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard/:organizerId')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getDashboardStats(@Param('organizerId') organizerId: string) {
    return this.analyticsService.getDashboardStats(organizerId);
  }

  @Get('revenue/:organizerId')
  @ApiOperation({ summary: 'Get revenue chart data' })
  async getRevenueChart(
    @Param('organizerId') organizerId: string,
    @Query('days') days?: string,
  ) {
    return this.analyticsService.getRevenueChart(organizerId, days ? parseInt(days) : 30);
  }

  @Get('sales/:organizerId')
  @ApiOperation({ summary: 'Get sales by event' })
  async getSalesByEvent(@Param('organizerId') organizerId: string) {
    return this.analyticsService.getSalesByEvent(organizerId);
  }

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get event performance' })
  async getEventPerformance(@Param('eventId') eventId: string) {
    return this.analyticsService.getEventPerformance(eventId);
  }

  @Get('top-events/:organizerId')
  @ApiOperation({ summary: 'Get top performing events' })
  async getTopEvents(
    @Param('organizerId') organizerId: string,
    @Query('limit') limit?: string,
  ) {
    return this.analyticsService.getTopEvents(organizerId, limit ? parseInt(limit) : 5);
  }
}
