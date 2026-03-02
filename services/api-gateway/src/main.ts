import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS configuration
  // En développement: localhost:3000 (NestJS local) et localhost:4000 (Next.js)
  // En production: les domaines Tikeo
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:4000',
    'https://tikeoh.com',
    'https://www.tikeoh.com',
  ];
  
  // Ajouter les origines depuis la variable d'environnement si elle existe
  if (process.env.ALLOWED_ORIGINS) {
    const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
    envOrigins.forEach((origin: string) => {
      if (!allowedOrigins.includes(origin.trim())) {
        allowedOrigins.push(origin.trim());
      }
    });
  }

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

  // ✅ Listen on Railway port (3001 from railway.json, fallback to 8080)
  const port = parseInt(process.env.PORT, 10) || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📚 Swagger docs available at: https://api-gateway-production-8ee0.up.railway.app/api/docs`);
}

bootstrap();