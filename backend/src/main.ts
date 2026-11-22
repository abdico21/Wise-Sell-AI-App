import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api/v1');
  app.useBodyParser('json', { limit: '8kb' });
  app.enableCors({
    origin: (process.env.FRONTEND_ORIGINS || '').split(',').map((value) => value.trim()).filter(Boolean),
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const port = Number(process.env.PORT || 10000);
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
