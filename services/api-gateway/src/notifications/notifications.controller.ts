import {
  Controller,
  Get,
  Patch,
  Delete,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { NotificationsService } from './notifications.service';
import { EmailService } from '../email/email.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly emailService: EmailService,
  ) {}

  @Get()
  async getNotifications(
    @Request() req,
    @Query('type') type?: string,
    @Query('read') read?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.notificationsService.getNotifications(req.user.id, {
      type,
      read: read !== undefined ? read === 'true' : undefined,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      sortBy,
    });
  }

  // ⚠️ read-all MUST be before :id to avoid route conflict
  @Patch('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Get(':id')
  async getNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.getNotificationById(req.user.id, id);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  async markAsRead(@Request() req, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Delete('all')
  @HttpCode(HttpStatus.OK)
  async deleteAllNotifications(@Request() req) {
    return this.notificationsService.deleteAllNotifications(req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteNotification(@Request() req, @Param('id') id: string) {
    return this.notificationsService.deleteNotification(req.user.id, id);
  }

  // ===================== ADMIN ENDPOINTS =====================

  @Post('admin/send')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async sendNotificationToUser(@Body() body: {
    userId?: string;
    userIds?: string[];
    email?: string;
    type: string;
    title: string;
    message: string;
    sendEmail: boolean;
    data?: Record<string, any>;
  }) {
    const { userId, userIds, email, type, title, message, sendEmail, data } = body;

    // Send to specific user(s)
    if (userIds && userIds.length > 0) {
      const results = await this.notificationsService.sendNotificationToUsers(userIds, type, title, message, data);
      
      // Send emails if requested
      if (sendEmail && email) {
        await this.emailService.sendCustomNotificationEmail(email, { type, title, message });
      }
      
      return { success: true, sentCount: results.length, results };
    }

    if (userId) {
      await this.notificationsService.createNotification({
        userId,
        type: type as any,
        title,
        message,
        data,
      });

      if (sendEmail && email) {
        await this.emailService.sendCustomNotificationEmail(email, { type, title, message });
      }

      return { success: true, sentCount: 1 };
    }

    // Send to specific email
    if (email && sendEmail) {
      await this.emailService.sendCustomNotificationEmail(email, { type, title, message });
      return { success: true, sentCount: 1, emailSent: true };
    }

    return { success: false, error: 'No valid recipient specified' };
  }

  @Post('admin/broadcast')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async broadcastNotification(@Body() body: {
    type: string;
    title: string;
    message: string;
    sendEmail: boolean;
    targetRole?: string;
    data?: Record<string, any>;
  }) {
    const { type, title, message, sendEmail, targetRole, data } = body;

    // Get users based on target
    const users = await this.notificationsService.getUsersForBroadcast(targetRole);
    
    if (users.length === 0) {
      return { success: false, error: 'No users found for broadcast' };
    }

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user.id,
      type: type as any,
      title,
      message,
      data,
    }));

    await this.notificationsService.createBulkNotifications(notifications);

    // If email requested, we would need to send to each user - this is a simplified version
    // In production, you'd want to use a job queue for this
    let emailsSent = 0;
    if (sendEmail) {
      // For broadcast emails, you'd typically use a bulk email service
      // This is just a placeholder
      emailsSent = 0; // Would need proper email list management
    }

    return { 
      success: true, 
      sentCount: users.length,
      notificationsCreated: users.length,
      emailsSent,
    };
  }

  @Get('admin/templates')
  @UseGuards(AdminGuard)
  async getNotificationTemplates() {
    return this.notificationsService.getNotificationTemplates();
  }

  @Get('admin/history')
  @UseGuards(AdminGuard)
  async getNotificationHistory(
    @Query('userId') userId?: string,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.notificationsService.getNotificationHistory({
      userId,
      type,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }
}

