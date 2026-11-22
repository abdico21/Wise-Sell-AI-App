import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  const origins = (process.env.CORS_ORIGINS || '').split(',').map(v => v.trim()).filter(Boolean);
  app.enableCors({ origin: origins.length ? origins : false, allowedHeaders: ['Content-Type', 'Authorization'], methods: ['GET', 'POST', 'OPTIONS'] });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }));
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();