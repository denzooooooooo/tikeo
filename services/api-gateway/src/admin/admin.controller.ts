import { Controller, Get, Post, Put, Patch, Param, Query, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, AdminGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  // ========== DASHBOARD ==========

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue statistics' })
  getRevenueStats(@Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return this.adminService.getRevenueStats(period);
  }

  // ========== USERS ==========

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination' })
  getUsers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers(Number(page), Number(limit), search, role);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  updateUserRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.updateUserRole(id, role);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Delete user' })
  deleteUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.deleteUser(id, req.user.id);
  }

  // ========== EVENTS ==========

  @Get('events')
  @ApiOperation({ summary: 'Get all events with pagination' })
  getEvents(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getEvents(Number(page), Number(limit), status, search);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Get event by ID' })
  getEventById(@Param('id') id: string) {
    return this.adminService.getEventById(id);
  }

  @Delete('events/:id')
  @ApiOperation({ summary: 'Delete event' })
  deleteEvent(@Param('id') id: string, @Request() req: any) {
    return this.adminService.deleteEvent(id, req.user.id);
  }

  @Patch('events/:id/status')
  @ApiOperation({ summary: 'Update event status' })
  updateEventStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Request() req: any,
  ) {
    return this.adminService.updateEventStatus(id, status, req.user.id);
  }

  // ========== TICKETS ==========

  @Get('tickets')
  @ApiOperation({ summary: 'Get all tickets with pagination' })
  getTickets(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('eventId') eventId?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getTickets(Number(page), Number(limit), eventId, status);
  }

  // ========== ORGANIZERS & PAYOUTS (CRUCIAL) ==========

  @Get('organizers/payouts')
  @ApiOperation({ summary: 'Get all organizers with payout info' })
  getOrganizersWithPayouts() {
    return this.adminService.getOrganizersWithPayouts();
  }

  @Post('payouts')
  @ApiOperation({ summary: 'Create a payout record' })
  createPayout(
    @Body() body: { organizerId: string; method: string; reference?: string },
    @Request() req: any,
  ) {
    return this.adminService.createPayoutRequest(body.organizerId, req.user.id, body.method, body.reference);
  }

  @Get('payouts')
  @ApiOperation({ summary: 'Get payout history' })
  getPayoutHistory(@Query('organizerId') organizerId?: string) {
    return this.adminService.getPayoutHistory(organizerId);
  }

  // ========== AUDIT LOGS ==========

  @Get('audit-logs')
  @ApiOperation({ summary: 'Get audit logs' })
  getAuditLogs(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
    @Query('adminId') adminId?: string,
    @Query('entity') entity?: string,
  ) {
    return this.adminService.getAuditLogs(Number(page), Number(limit), adminId, entity);
  }

  // ========== RECENT ORDERS ==========

  @Get('orders/recent')
  @ApiOperation({ summary: 'Get recent orders' })
  getRecentOrders(@Query('limit') limit = 10) {
    return this.adminService.getRecentOrders(Number(limit));
  }

  // ========== TOP EVENTS ==========

  @Get('events/top')
  @ApiOperation({ summary: 'Get top events by revenue' })
  getTopEvents(@Query('limit') limit = 10) {
    return this.adminService.getTopEvents(Number(limit));
  }

  // ========== TOP ORGANIZERS ==========

  @Get('organizers/top')
  @ApiOperation({ summary: 'Get top organizers by revenue' })
  getTopOrganizers(@Query('limit') limit = 10) {
    return this.adminService.getTopOrganizers(Number(limit));
  }

  // ========== PLATFORM HEALTH ==========

  @Get('health')
  @ApiOperation({ summary: 'Get platform health metrics' })
  getPlatformHealth() {
    return this.adminService.getPlatformHealth();
  }

  // ========== CATEGORY STATS ==========

  @Get('stats/categories')
  @ApiOperation({ summary: 'Get events by category' })
  getCategoryStats() {
    return this.adminService.getCategoryStats();
  }

  // ========== ADMIN MANAGEMENT ==========

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  getAdmins() {
    return this.adminService.getAdmins();
  }

  @Post('admins')
  @ApiOperation({ summary: 'Create a new admin' })
  createAdmin(@Body() body: { email: string }, @Request() req: any) {
    return this.adminService.createAdmin(body.email, req.user.id);
  }

  @Delete('admins/:id')
  @ApiOperation({ summary: 'Remove admin role from user' })
  removeAdmin(@Param('id') id: string, @Request() req: any) {
    return this.adminService.removeAdmin(id, req.user.id);
  }

  // ========== PAYOUT NOTIFICATIONS ==========

  @Post('organizers/:id/send-payout-reminder')
  @ApiOperation({ summary: 'Send payout reminder email to organizer' })
  sendPayoutReminder(@Param('id') id: string) {
    return this.adminService.sendPayoutReminderEmail(id);
  }

  @Post('payouts/:id/send-confirmation')
  @ApiOperation({ summary: 'Send payout confirmation email to organizer' })
  sendPayoutConfirmation(@Param('id') id: string) {
    // Get organizer ID from payout record
    return this.adminService.getPayoutHistory(id).then(payouts => {
      const payout = payouts[0];
      if (!payout) throw new Error('Payout non trouvé');
      return this.adminService.sendPayoutCompletedEmail(payout.organizerId, id);
    });
  }
}

