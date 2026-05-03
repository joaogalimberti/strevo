import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutsService: WorkoutsService) {}

  @Post()
  create(@Request() req, @Body() body: any) {
    return this.workoutsService.create(req.user.userId, body);
  }

  @Get()
  findAll(@Request() req) {
    return this.workoutsService.findAll(req.user.userId);
  }
}
