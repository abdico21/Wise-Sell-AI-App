import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { GenerateContentDto } from './ai.dto';
import { AuthenticatedRequest, SupabaseAuthGuard } from './supabase-auth.guard';

@Controller('ai')
@UseGuards(SupabaseAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate-content')
  generate(@Body() body: GenerateContentDto, @Req() request: AuthenticatedRequest) {
    return this.aiService.generate(body, request.user.id);
  }
}
