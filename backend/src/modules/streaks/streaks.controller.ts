import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('streaks')
export class StreaksController {
  constructor(private streaksService: StreaksService) {}

  @Get()
  getStreak(@Request() req) {
    return this.streaksService.getStreak(req.user.userId);
  }
}
