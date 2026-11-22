import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { HealthController } from './health.controller';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { FirebaseAuthGuard } from './security/firebase-auth.guard';
import { FirebaseAuthService } from './security/firebase-auth.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }])],
  controllers: [HealthController, AiController],
  providers: [AiService, FirebaseAuthGuard, FirebaseAuthService, PrismaService, { provide: APP_GUARD, useClass: ThrottlerGuard }]
})
export class AppModule {}