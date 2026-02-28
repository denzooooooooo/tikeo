import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-intent')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer une intention de paiement Stripe' })
  @ApiResponse({ status: 201, description: 'Intention de paiement créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async createPaymentIntent(@Body() body: { orderId: string; amount: number }) {
    try {
      return await this.paymentsService.createPaymentIntent(body.orderId, body.amount);
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Erreur lors de la création du paiement',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('confirm-payment')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmer un paiement Stripe' })
  @ApiResponse({ status: 200, description: 'Paiement confirmé' })
  @ApiResponse({ status: 400, description: 'Paiement échoué' })
  async confirmPayment(@Body() body: { paymentIntentId: string }) {
    try {
      return await this.paymentsService.confirmPayment(body.paymentIntentId);
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Erreur lors de la confirmation du paiement',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('refund')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Demander un remboursement' })
  @ApiResponse({ status: 200, description: 'Remboursement effectué' })
  @ApiResponse({ status: 400, description: 'Remboursement impossible' })
  async requestRefund(@Body() body: { paymentId: string }) {
    try {
      return await this.paymentsService.refundPayment(body.paymentId);
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'Erreur lors du remboursement',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
