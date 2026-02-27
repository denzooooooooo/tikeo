import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { PromoCodesService } from './promo-codes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('promo-codes')
export class PromoCodesController {
  constructor(private readonly promoCodesService: PromoCodesService) {}

  // ============ PUBLIC ENDPOINTS ============

  @Get('validate')
  async validate(
    @Query('code') code: string,
    @Query('userId') userId: string,
    @Query('eventId') eventId?: string,
    @Query('totalAmount') totalAmount?: string,
  ) {
    return this.promoCodesService.validatePromoCode(
      code,
      userId,
      eventId,
      totalAmount ? parseFloat(totalAmount) : undefined,
    );
  }

  // ============ ORGANIZER ENDPOINTS ============

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPromoCode(
    @Request() req: any,
    @Body() body: {
      code: string;
      discountType: 'PERCENTAGE' | 'FIXED';
      discountValue: number;
      minPurchase?: number;
      maxUses?: number;
      maxUsesPerUser?: number;
      startsAt?: Date;
      expiresAt?: Date;
      applicableEvents?: string[];
      applicableCategories?: string[];
    },
  ) {
    // Get organizer's user ID from token
    const organizer = await this.promoCodesService['prisma'].organizer.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!organizer) {
      throw new Error('Vous devez être organisateur pour créer un code promo');
    }
    
    return this.promoCodesService.createPromoCode(organizer.id, body);
  }

  @Get('organizer')
  @UseGuards(JwtAuthGuard)
  async getOrganizerPromoCodes(@Request() req: any) {
    const organizer = await this.promoCodesService['prisma'].organizer.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!organizer) {
      throw new Error('Organisateur non trouvé');
    }
    
    return this.promoCodesService.getOrganizerPromoCodes(organizer.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPromoCodeById(@Param('id') id: string) {
    return this.promoCodesService.getPromoCodeById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePromoCode(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: {
      discountType?: 'PERCENTAGE' | 'FIXED';
      discountValue?: number;
      minPurchase?: number;
      maxUses?: number;
      maxUsesPerUser?: number;
      startsAt?: Date;
      expiresAt?: Date;
      isActive?: boolean;
    },
  ) {
    const organizer = await this.promoCodesService['prisma'].organizer.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!organizer) {
      throw new Error('Organisateur non trouvé');
    }
    
    return this.promoCodesService.updatePromoCode(id, organizer.id, body);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePromoCode(@Request() req: any, @Param('id') id: string) {
    const organizer = await this.promoCodesService['prisma'].organizer.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!organizer) {
      throw new Error('Organisateur non trouvé');
    }
    
    return this.promoCodesService.deletePromoCode(id, organizer.id);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  async getPromoCodeStats(@Request() req: any, @Param('id') id: string) {
    const organizer = await this.promoCodesService['prisma'].organizer.findFirst({
      where: { userId: req.user.id },
    });
    
    if (!organizer) {
      throw new Error('Organisateur non trouvé');
    }
    
    return this.promoCodesService.getPromoCodeStats(id, organizer.id);
  }

  // ============ APPLY TO ORDER ============

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  async applyPromoCode(
    @Request() req: any,
    @Body() body: { code: string; orderId: string },
  ) {
    return this.promoCodesService.applyPromoCode(body.code, req.user.id, body.orderId);
  }
}

