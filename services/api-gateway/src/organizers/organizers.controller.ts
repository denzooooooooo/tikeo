import { Controller, Get, Param, Query, Put, Body, UseGuards } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Get()
  findAll() {
    return this.organizersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizersService.findOne(id);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.organizersService.findByUserId(userId);
  }

  // Payout Configuration endpoints
  @Put('payout-config')
  @UseGuards(JwtAuthGuard)
  updatePayoutConfig(
    @Body() payoutData: {
      payoutMethod: string;
      payoutPhone?: string;
      payoutEmail?: string;
      payoutIban?: string;
      payoutBankName?: string;
      payoutSwift?: string;
    },
  ) {
    return this.organizersService.updatePayoutConfig(payoutData);
  }

  @Get('payout/pending')
  @UseGuards(JwtAuthGuard)
  getPendingPayouts() {
    return this.organizersService.getPendingPayouts();
  }

  @Get('revenue/summary')
  @UseGuards(JwtAuthGuard)
  getRevenueSummary() {
    return this.organizersService.getRevenueSummary();
  }
}

