import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { AiService } from './ai.service';
import { FirebaseAuthGuard } from '../security/firebase-auth.guard';
class AssistDto {
  @IsString() @MinLength(1) @MaxLength(4000) prompt!: string;
}
@Controller('ai')
@UseGuards(FirebaseAuthGuard)
export class AiController {
  constructor(private readonly ai: AiService) {}
  @Post('assist') assist(@Body() body: AssistDto, @requireUser() user: any) { return this.ai.assist(body.prompt, user.uid); }
}