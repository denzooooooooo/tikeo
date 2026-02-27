import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('type') type?: string,
    @Query('read') read?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getNotifications(req.user.id, {
      type,
      read: read !== undefined ? read === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.notificationsService.getNotificationPreferences(req.user.id);
  }

  @Put('preferences')
  async updatePreferences(
    @Request() req,
    @Body()
    body: {
      email?: boolean;
      push?: boolean;
      sms?: boolean;
      orderConfirmation?: boolean;
      eventReminders?: boolean;
      newEvents?: boolean;
      promotions?: boolean;
      organizerUpdates?: boolean;
    },
  ) {
    return this.notificationsService.updateNotificationPreferences(
      req.user.id,
      body,
    );
  }

  @Get(':id')
  async getNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.getNotificationById(req.user.id, id);
  }

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Put('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.id, id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAllNotifications(@Request() req) {
    return this.notificationsService.deleteAllNotifications(req.user.id);
  }
}

