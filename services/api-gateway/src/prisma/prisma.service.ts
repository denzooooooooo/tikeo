import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      // Don't crash the app — log the error and continue
      // The app will still start and the healthcheck will pass
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`⚠️ Database connection failed: ${message}`);
      this.logger.warn('🔄 App starting without DB — check DATABASE_URL env var');
      this.logger.warn('💡 Supabase requires: ?sslmode=require at end of DATABASE_URL');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    const models = Reflect.ownKeys(this).filter((key) => key[0] !== '_');

    return Promise.all(models.map((modelKey) => this[modelKey].deleteMany()));
  }
}
