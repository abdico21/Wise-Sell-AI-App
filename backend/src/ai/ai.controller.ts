import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { FirebaseAuthGuard } from '../security/firebase-auth.guard';
import { AiService } from './ai.service';

class GenerateDto {
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  prompt: string;
}

@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}
  @Post('assist')
  async assist(@Body() body: GenerateDto, @Req() req: any) {
    return this.ai.assist(req.user.uid, body.prompt);
  }
}
