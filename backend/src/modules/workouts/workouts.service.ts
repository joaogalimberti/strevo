import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { StreaksService } from '../streaks/streaks.service';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService, private streaksService: StreaksService) {}

  async create(userId: string, data: any) {
    const { startTime, endTime, duration, type } = data;
    const workout = await this.prisma.workout.create({
      data: { userId, startTime: new Date(startTime), endTime: new Date(endTime), duration, type }
    });

    await this.streaksService.updateStreak(userId, new Date(endTime));

    return workout;
  }

  async findAll(userId: string) {
    return this.prisma.workout.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
}
