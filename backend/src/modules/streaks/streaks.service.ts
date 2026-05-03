import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class StreaksService {
  constructor(private prisma: PrismaService) {}

  async getStreak(userId: string) {
    return this.prisma.streak.findUnique({ where: { userId } });
  }

  async updateStreak(userId: string, workoutDate: Date) {
    const streak = await this.prisma.streak.findUnique({ where: { userId } });
    if (!streak) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWorkout = new Date(streak.lastWorkoutDate);
    lastWorkout.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastWorkout.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let currentStreak = streak.currentStreak;
    let bestStreak = streak.bestStreak;

    if (diffDays === 1 || (diffDays === 0 && currentStreak === 0)) {
      currentStreak += 1;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }

    if (currentStreak > bestStreak) {
      bestStreak = currentStreak;
    }

    return this.prisma.streak.update({
      where: { userId },
      data: { currentStreak, bestStreak, lastWorkoutDate: workoutDate }
    });
  }
}
