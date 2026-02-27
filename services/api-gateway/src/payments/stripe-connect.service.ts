import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StripeConnectService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {}

  async createConnectAccount(userId: string, email: string) {
    // In production, this would create a Stripe Connect account
    // For now, return a mock account ID
    const stripeAccountId = `acct_mock_${userId}`;
    
    await this.prisma.organizer.updateMany({
      where: { userId },
      data: {
        stripeAccountId,
        stripeConnected: true,
      },
    });

    return { stripeAccountId };
  }

  async getConnectAccountStatus(organizerId: string) {
    const organizer = await this.prisma.organizer.findUnique({
      where: { id: organizerId },
    });

    return {
      connected: organizer?.stripeConnected || false,
      accountId: organizer?.stripeAccountId,
    };
  }

  async createAccountLink(stripeAccountId: string) {
    // In production, this would create a Stripe account link
    return {
      url: `https://connect.stripe.com/setup/s/${stripeAccountId}`,
    };
  }
}

