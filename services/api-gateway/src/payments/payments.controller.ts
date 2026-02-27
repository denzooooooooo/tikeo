import { Controller, Post, Body, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly httpService: HttpService) {}

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une intention de paiement Stripe' })
  @ApiBody({
    description: 'Données pour créer l\'intention de paiement',
    schema: {
      type: 'object',
      properties: {
        amount: { type: 'number', example: 4500, description: 'Montant en centimes' },
        currency: { type: 'string', example: 'eur', default: 'eur' },
        eventId: { type: 'string', example: 'event-uuid' },
        ticketTypeId: { type: 'string', example: 'ticket-type-uuid' },
        quantity: { type: 'number', example: 2, minimum: 1 },
        metadata: {
          type: 'object',
          additionalProperties: true,
          example: { userId: 'user-uuid', eventName: 'Festival Jazz' }
        }
      },
      required: ['amount', 'eventId', 'ticketTypeId', 'quantity']
    }
  })
  @ApiResponse({ status: 201, description: 'Intention de paiement créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async createPaymentIntent(@Body() paymentIntentDto: any) {
    try {
      const url = 'http://payment-service:3003/payments/create-payment-intent';
      const response = await firstValueFrom(
        this.httpService.post(url, paymentIntentDto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getTokenFromRequest(),
          }
        })
      );
      return response.data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new HttpException(
        'Erreur lors de la création de l\'intention de paiement',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('confirm-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirmer un paiement Stripe' })
  @ApiBody({
    description: 'Données de confirmation de paiement',
    schema: {
      type: 'object',
      properties: {
        paymentIntentId: { type: 'string', example: 'pi_stripe_payment_intent_id' },
        paymentMethodId: { type: 'string', example: 'pm_stripe_payment_method_id' }
      },
      required: ['paymentIntentId', 'paymentMethodId']
    }
  })
  @ApiResponse({ status: 200, description: 'Paiement confirmé avec succès' })
  @ApiResponse({ status: 400, description: 'Paiement échoué' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async confirmPayment(@Body() confirmPaymentDto: any) {
    try {
      const url = 'http://payment-service:3003/payments/confirm-payment';
      const response = await firstValueFrom(
        this.httpService.post(url, confirmPaymentDto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getTokenFromRequest(),
          }
        })
      );
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 400) {
        throw new HttpException('Paiement échoué', HttpStatus.BAD_REQUEST);
      }
      console.error('Error confirming payment:', error);
      throw new HttpException(
        'Erreur lors de la confirmation du paiement',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Webhook Stripe pour les événements de paiement' })
  @ApiBody({
    description: 'Payload du webhook Stripe',
    schema: {
      type: 'object',
      additionalProperties: true
    }
  })
  @ApiResponse({ status: 200, description: 'Webhook traité avec succès' })
  async handleWebhook(@Body() webhookData: any) {
    try {
      // Forward webhook to payment service
      const url = 'http://payment-service:3003/payments/webhook';
      const response = await firstValueFrom(
        this.httpService.post(url, webhookData, {
          headers: {
            'Content-Type': 'application/json',
            'stripe-signature': this.getStripeSignatureFromRequest(),
          }
        })
      );
      return response.data;
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw new HttpException(
        'Erreur lors du traitement du webhook',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
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
        orderId: { type: 'string', example: 'order-uuid' },
        amount: { type: 'number', example: 4500, description: 'Montant à rembourser en centimes' },
        reason: { type: 'string', example: 'Événement annulé', enum: ['event_cancelled', 'customer_request', 'duplicate', 'fraudulent'] }
      },
      required: ['orderId', 'reason']
    }
  })
  @ApiResponse({ status: 200, description: 'Remboursement demandé avec succès' })
  @ApiResponse({ status: 400, description: 'Remboursement impossible' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async requestRefund(@Body() refundDto: any) {
    try {
      const url = 'http://payment-service:3003/payments/refund';
      const response = await firstValueFrom(
        this.httpService.post(url, refundDto, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.getTokenFromRequest(),
          }
        })
      );
      return response.data;
    } catch (error) {
      if ((error as any).response?.status === 400) {
        throw new HttpException('Remboursement impossible', HttpStatus.BAD_REQUEST);
      }
      console.error('Error requesting refund:', error);
      throw new HttpException(
        'Erreur lors de la demande de remboursement',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Helper methods for token and signature extraction
  private getTokenFromRequest(): string {
    // Implement proper token extraction from request context
    return '';
  }

  private getStripeSignatureFromRequest(): string {
    // Implement proper Stripe signature extraction from headers
    return '';
  }
}
