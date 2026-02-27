import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { TicketsModule } from './tickets/tickets.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Configuration globale
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate limiting pour protection contre les abus
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requêtes par minute
      },
    ]),

    // Module HTTP pour les appels vers les microservices
    HttpModule.register({
      timeout: 5000, // 5 secondes timeout
      maxRedirects: 5,
    }),

    // Modules de données
    PrismaModule,
    RedisModule,

    // Modules fonctionnels - API Gateway
    HealthModule,
    AuthModule,
    EventsModule,
    TicketsModule,
    OrdersModule,
    UsersModule,
  ],
})
export class AppModule {}
