import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post('generate')
  generate(@Request() req, @Body() body: { workoutId: string, style: string, photoBase64?: string }) {
    return this.storiesService.generateStory(req.user.userId, body.workoutId, body.style, body.photoBase64);
  }
}
