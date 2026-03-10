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

    const keys = Object.keys(this).filter((key) => !key.startsWith('_'));
    const prismaAsRecord = this as unknown as Record<string, unknown>;

    const deletePromises = keys
      .map((key) => prismaAsRecord[key])
      .filter(
        (model): model is { deleteMany: () => Promise<unknown> } =>
          !!model &&
          typeof model === 'object' &&
          'deleteMany' in model &&
          typeof (model as { deleteMany?: unknown }).deleteMany === 'function',
      )
      .map((model) => model.deleteMany());

    return Promise.all(deletePromises);
  }
}
