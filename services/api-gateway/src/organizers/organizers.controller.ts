import { Controller, Get, Param, Query, Put, Body, UseGuards, Request } from '@nestjs/common';
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
    @Request() req: any,
    @Body() payoutData: {
      payoutMethod: string;
      payoutPhone?: string;
      payoutEmail?: string;
      payoutIban?: string;
      payoutBankName?: string;
      payoutSwift?: string;
    },
  ) {
    return this.organizersService.updatePayoutConfig(req.user.id, payoutData);
  }

  @Get('payout/config')
  @UseGuards(JwtAuthGuard)
  getPayoutConfig(@Request() req: any) {
    return this.organizersService.getPayoutConfig(req.user.id);
  }

  @Get('payout/pending')
  @UseGuards(JwtAuthGuard)
  getPendingPayouts(@Request() req: any) {
    return this.organizersService.getPendingPayouts(req.user.id);
  }

  @Get('revenue/summary')
  @UseGuards(JwtAuthGuard)
  getRevenueSummary(@Request() req: any) {
    return this.organizersService.getRevenueSummary(req.user.id);
  }
}

