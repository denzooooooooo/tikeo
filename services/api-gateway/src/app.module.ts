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
import { ContestsModule } from './contests/contests.module';
import { OrganizersModule } from './organizers/organizers.module';
import { BlogModule } from './blog/blog.module';
import { VotesModule } from './votes/votes.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LikesModule } from './likes/likes.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SearchModule } from './search/search.module';
import { PaymentsModule } from './payments/payments.module';
import { PromoCodesModule } from './promo-codes/promo-codes.module';
import { HelpModule } from './help/help.module';
// import { ActivityFeedModule } from './activity-feed/activity-feed.module';
import { AIModule } from './ai/ai.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ContestantsModule } from './contestants/contestants.module';
import { ContestVotesModule } from './contest-votes/contest-votes.module';
import { EmailModule } from './email/email.module';

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
    
    // Modules additionnels - ajoutés pour corriger les erreurs 404
    ContestsModule,
    OrganizersModule,
    BlogModule,
    VotesModule,
    NotificationsModule,
    ReviewsModule,
    LikesModule,
    FavoritesModule,
    SearchModule,
    PaymentsModule,
    PromoCodesModule,
    HelpModule,
    // ActivityFeedModule, // Commenté temporairement - nécessite plus de travail
    AIModule,
    AnalyticsModule,
    ContestantsModule,
    ContestVotesModule,
    EmailModule,
  ],
})
export class AppModule {}
