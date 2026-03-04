import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Créer une intention de paiement Stripe (connecté ou invité)' })
  @ApiBody({
    description: 'Données pour créer l\'intention de paiement',
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'string', example: 'order-uuid' },
        amount: { type: 'number', example: 45.00, description: 'Montant en euros' },
      },
      required: ['orderId', 'amount']
    }
  })
  @ApiResponse({ status: 201, description: 'Intention de paiement créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async createPaymentIntent(@Body() body: { orderId: string; amount: number }, @Request() req: any) {
    try {
      return await this.paymentsService.createPaymentIntent(body.orderId, body.amount);
    } catch (error) {
      const message = (error as Error).message || 'Erreur lors de la création de l\'intention de paiement';
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('confirm-payment')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Confirmer un paiement Stripe' })
  @ApiBody({
    description: 'Données de confirmation de paiement',
    schema: {
      type: 'object',
      properties: {
        paymentIntentId: { type: 'string', example: 'pi_stripe_payment_intent_id' },
      },
      required: ['paymentIntentId']
    }
  })
  @ApiResponse({ status: 200, description: 'Paiement confirmé avec succès' })
  @ApiResponse({ status: 400, description: 'Paiement échoué' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async confirmPayment(@Body() body: { paymentIntentId: string }) {
    try {
      return await this.paymentsService.confirmPayment(body.paymentIntentId);
    } catch (error) {
      throw new HttpException('Paiement échoué', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('refund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Demander un remboursement' })
  @ApiBody({
    description: 'Données de remboursement',
    schema: {
      type: 'object',
      properties: {
        paymentId: { type: 'string', example: 'payment-uuid' },
      },
      required: ['paymentId']
    }
  })
  @ApiResponse({ status: 200, description: 'Remboursement demandé avec succès' })
  @ApiResponse({ status: 400, description: 'Remboursement impossible' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async requestRefund(@Body() body: { paymentId: string }) {
    try {
      return await this.paymentsService.refundPayment(body.paymentId);
    } catch (error) {
      throw new HttpException('Remboursement impossible', HttpStatus.BAD_REQUEST);
    }
  }
}
