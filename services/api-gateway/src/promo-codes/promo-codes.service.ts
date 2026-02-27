import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromoCodesService {
  constructor(private prisma: PrismaService) {}

  // ============ CREATE PROMO CODE ============

  async createPromoCode(organizerId: string, data: {
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
  }) {
    // Check if code already exists
    const existing = await this.prisma.promoCode.findFirst({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw new BadRequestException('Ce code promo existe déjà');
    }

    // Validate discount
    if (data.discountType === 'PERCENTAGE' && (data.discountValue < 1 || data.discountValue > 100)) {
      throw new BadRequestException('Le pourcentage doit être entre 1% et 100%');
    }

    const promoCode = await this.prisma.promoCode.create({
      data: {
        code: data.code.toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchase: data.minPurchase,
        maxUses: data.maxUses,
        maxUsesPerUser: data.maxUsesPerUser,
        startsAt: data.startsAt || new Date(),
        expiresAt: data.expiresAt,
        organizerId,
        applicableEvents: data.applicableEvents || [],
        applicableCategories: data.applicableCategories || [],
      },
    });

    return promoCode;
  }

  // ============ VALIDATE & APPLY PROMO CODE ============

  async validatePromoCode(code: string, userId: string, eventId?: string, totalAmount?: number) {
    const promoCode = await this.prisma.promoCode.findFirst({
      where: { code: code.toUpperCase() },
      include: {
        organizer: {
          select: { id: true, companyName: true },
        },
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Code promo invalide');
    }

    // Check if active
    const now = new Date();
    if (promoCode.startsAt && now < promoCode.startsAt) {
      throw new BadRequestException('Ce code promo n\'est pas encore actif');
    }

    if (promoCode.expiresAt && now > promoCode.expiresAt) {
      throw new BadRequestException('Ce code promo a expiré');
    }

    // Check max uses
    if (promoCode.maxUses && promoCode.usedCount >= promoCode.maxUses) {
      throw new BadRequestException('Ce code promo a atteint sa limite d\'utilisation');
    }

    // Check min purchase
    if (totalAmount && promoCode.minPurchase && totalAmount < promoCode.minPurchase) {
      throw new BadRequestException(`Achats minimums de ${promoCode.minPurchase}€ requis`);
    }

    // Check event applicability
    if (eventId && promoCode.applicableEvents.length > 0) {
      if (!promoCode.applicableEvents.includes(eventId)) {
        throw new BadRequestException('Ce code promo n\'est pas applicable à cet événement');
      }
    }

    // Check user usage limit
    if (promoCode.maxUsesPerUser) {
      const userUsage = await this.prisma.promoCodeUsage.count({
        where: {
          promoCodeId: promoCode.id,
          userId,
        },
      });

      if (userUsage >= promoCode.maxUsesPerUser) {
        throw new BadRequestException('Vous avez atteint la limite d\'utilisation de ce code promo');
      }
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'PERCENTAGE') {
      discount = (totalAmount || 0) * (promoCode.discountValue / 100);
    } else {
      discount = Math.min(promoCode.discountValue, totalAmount || 0);
    }

    return {
      valid: true,
      promoCode: {
        id: promoCode.id,
        code: promoCode.code,
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue,
      },
      discount,
      organizer: promoCode.organizer,
    };
  }

  // ============ APPLY PROMO CODE TO ORDER ============

  async applyPromoCode(code: string, userId: string, orderId: string) {
    // First validate
    const validation = await this.validatePromoCode(code, userId);

    // Record usage
    await this.prisma.promoCodeUsage.create({
      data: {
        promoCodeId: validation.promoCode.id,
        userId,
        orderId,
      },
    });

    // Update used count
    await this.prisma.promoCode.update({
      where: { id: validation.promoCode.id },
      data: { usedCount: { increment: 1 } },
    });

    return {
      success: true,
      discount: validation.discount,
      message: `Code promo appliqué: -${validation.discount.toFixed(2)}€`,
    };
  }

  // ============ GET PROMO CODES ============

  async getOrganizerPromoCodes(organizerId: string) {
    return this.prisma.promoCode.findMany({
      where: { organizerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromoCodeById(id: string) {
    const promoCode = await this.prisma.promoCode.findUnique({
      where: { id },
      include: {
        organizer: {
          select: { id: true, companyName: true },
        },
        usages: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!promoCode) {
      throw new NotFoundException('Code promo non trouvé');
    }

    return promoCode;
  }

  // ============ UPDATE PROMO CODE ============

  async updatePromoCode(id: string, organizerId: string, data: {
    discountType?: 'PERCENTAGE' | 'FIXED';
    discountValue?: number;
    minPurchase?: number;
    maxUses?: number;
    maxUsesPerUser?: number;
    startsAt?: Date;
    expiresAt?: Date;
    isActive?: boolean;
  }) {
    const promoCode = await this.prisma.promoCode.findFirst({
      where: { id, organizerId },
    });

    if (!promoCode) {
      throw new NotFoundException('Code promo non trouvé');
    }

    return this.prisma.promoCode.update({
      where: { id },
      data,
    });
  }

  // ============ DELETE PROMO CODE ============

  async deletePromoCode(id: string, organizerId: string) {
    const promoCode = await this.prisma.promoCode.findFirst({
      where: { id, organizerId },
    });

    if (!promoCode) {
      throw new NotFoundException('Code promo non trouvé');
    }

    // Soft delete - deactivate instead of delete
    return this.prisma.promoCode.update({
      where: { id },
      data: { isActive: false },
    });
  }

  // ============ GET PROMO CODE STATS ============

  async getPromoCodeStats(id: string, organizerId: string) {
    const promoCode = await this.prisma.promoCode.findFirst({
      where: { id, organizerId },
    });

    if (!promoCode) {
      throw new NotFoundException('Code promo non trouvé');
    }

    const totalUsage = await this.prisma.promoCodeUsage.count({
      where: { promoCodeId: id },
    });

    const totalDiscount = await this.prisma.promoCodeUsage.aggregate({
      where: { promoCodeId: id },
      _sum: { discountAmount: true },
    });

    return {
      ...promoCode,
      totalUsage,
      totalDiscount: totalDiscount._sum.discountAmount || 0,
    };
  }
}

