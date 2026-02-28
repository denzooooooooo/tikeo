import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TicketsController } from './tickets.controller';

@Module({
  imports: [HttpModule],
  controllers: [TicketsController],
  providers: [],
  exports: [],
})
export class TicketsModule {}
