import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS configuration
  const allowedOrigins =
    process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',        // local dev
      'https://tikeoh.com',           // prod
      'https://www.tikeoh.com',       // prod
    ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // ✅ Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // ✅ API prefix
  app.setGlobalPrefix('api/v1');

  // ✅ Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Tikeo API')
    .setDescription('API de la plateforme de billetterie Tikeo')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification')
    .addTag('events', 'Événements')
    .addTag('tickets', 'Billets')
    .addTag('orders', 'Commandes')
    .addTag('users', 'Utilisateurs')
    .addTag('analytics', 'Analytics')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // ✅ Listen on Railway port
  const port = parseInt(process.env.PORT, 10) || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(
    `📚 Swagger docs available at: ${allowedOrigins[0]}/api/docs (replace with your front URL)`
  );
}

bootstrap();