import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    NotificationsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/events',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          cb(null, `cover-${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);

        },
      }),
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}

