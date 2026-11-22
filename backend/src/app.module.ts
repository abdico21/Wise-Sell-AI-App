import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthController } from './health.controller';
import { FirebaseAuthService } from './security/firebase-auth.service';
import { AiController } from './ai/ai.controller';
import { AiService } from './ai/ai.service';
import { PrismaService } from './database/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }])
  ],
  controllers: [HealthController, AiController],
  providers: [FirebaseAuthService, AiService, PrismaService]
})
export class AppModule {}
