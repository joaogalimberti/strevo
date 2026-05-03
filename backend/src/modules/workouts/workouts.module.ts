import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaService } from '../../prisma.service';
import { StreaksService } from '../streaks/streaks.service';

@Module({
  controllers: [WorkoutsController],
  providers: [WorkoutsService, PrismaService, StreaksService],
})
export class WorkoutsModule {}
