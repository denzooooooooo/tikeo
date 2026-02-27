import { Injectable, Post, Body, Get, Param, Query, UseGuards, Req } from '@nestjs/common';
import { StripeConnectService } from './stripe-connect.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '@prisma/client';

@Injectable()
export class StripeConnectController {
  constructor(private readonly stripeConnectService: StripeConnectService) {}

  // Create Stripe Connect account for organizer
  @Post('connect/create-account')
  @UseGuards(JwtAuthGuard)
  async createConnectAccount(@CurrentUser() user: User) {
    const organizer = await this.getOrganizerByUserId(user.id);
    return this.stripeConnectService.createConnectAccount(organizer.id, user.email);
  }

  // Get onboarding link
  @Get('connect/onboarding-link')
  @UseGuards(JwtAuthGuard)
  async getOnboardingLink(
    @CurrentUser() user: User,
    @Query('returnUrl') returnUrl?: string,
  ) {
    const organizer = await this.getOrganizerByUserId(user.id);
    if (!organizer.stripeAccountId) {
      const account = await this.stripeConnectService.createConnectAccount(organizer.id, user.email);
      return { url: account.onboardingUrl };
    }
    const url = await this.stripeConnectService.createAccountLink(organizer.stripeAccountId, returnUrl);
    return { url };
  }

  // Check account status
  @Get('connect/account-status')
  @UseGuards(JwtAuthGuard)
  async getAccountStatus(@CurrentUser() user: User) {
    const organizer = await this.getOrganizerByUserId(user.id);
    if (!organizer.stripeAccountId) {
      return { status: 'not_setup' };
    }
    return this.stripeConnectService.checkAccountStatus(organizer.stripeAccountId);
  }

  // Create payment intent
  @Post('connect/payment-intent')
  async createPaymentIntent(
    @Body() body: { eventId: string; ticketQuantities: { ticketTypeId: string; quantity: number }[]; customerEmail: string },
  ) {
    return this.stripeConnectService.createPaymentIntent(
      body.eventId,
      body.ticketQuantities,
      body.customerEmail,
    );
  }

  // Create checkout session
  @Post('connect/checkout-session')
  async createCheckoutSession(
    @Body() body: {
      eventId: string;
      ticketQuantities: { ticketTypeId: string; quantity: number }[];
      customerEmail: string;
      successUrl: string;
      cancelUrl: string;
    },
  ) {
    return this.stripeConnectService.createCheckoutSession(
      body.eventId,
      body.ticketQuantities,
      body.customerEmail,
      body.successUrl,
      body.cancelUrl,
    );
  }

  // Create refund
  @Post('connect/refund')
  async createRefund(
    @Body() body: { paymentIntentId: string; amount?: number; reason?: string },
  ) {
    return this.stripeConnectService.createRefund(body.paymentIntentId, body.amount, body.reason);
  }

  // Get account balance
  @Get('connect/balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser() user: User) {
    const organizer = await this.getOrganizerByUserId(user.id);
    if (!organizer.stripeAccountId) {
      return { error: 'Stripe account not configured' };
    }
    return this.stripeConnectService.getAccountBalance(organizer.stripeAccountId);
  }

  // Create payout
  @Post('connect/payout')
  @UseGuards(JwtAuthGuard)
  async createPayout(
    @CurrentUser() user: User,
    @Body() body: { amount: number; currency?: string },
  ) {
    const organizer = await this.getOrganizerByUserId(user.id);
    if (!organizer.stripeAccountId) {
      return { error: 'Stripe account not configured' };
    }
    return this.stripeConnectService.createPayout(organizer.stripeAccountId, body.amount, body.currency);
  }

  // Get transaction history
  @Get('connect/transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(
    @CurrentUser() user: User,
    @Query('limit') limit?: number,
  ) {
    const organizer = await this.getOrganizerByUserId(user.id);
    if (!organizer.stripeAccountId) {
      return { error: 'Stripe account not configured' };
    }
    return this.stripeConnectService.getTransactionHistory(organizer.stripeAccountId, limit);
  }

  // Webhook handler
  @Post('connect/webhook')
  async handleWebhook(@Body() body: any) {
    // Stripe webhooks are handled in the main payments controller
    return { received: true };
  }

  private async getOrganizerByUserId(userId: string) {
    const { PrismaService } = await import('../prisma/prisma.service');
    const prisma = new PrismaService();
    const organizer = await prisma.organizer.findFirst({
      where: { userId },
    });
    if (!organizer) {
      throw new Error('Organizer not found');
    }
    return organizer;
  }
}
