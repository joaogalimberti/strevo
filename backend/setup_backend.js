const fs = require('fs');
const path = require('path');

const files = {
  'src/prisma.service.ts': `import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
`,
  'src/modules/auth/auth.module.ts': `import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { PrismaService } from '../../prisma.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret', // In production, use env
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy],
})
export class AuthModule {}
`,
  'src/modules/auth/jwt.strategy.ts': `import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'super-secret',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
`,
  'src/modules/auth/auth.service.ts': `import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(data: any) {
    const { username, email, password } = data;
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (existing) throw new BadRequestException('User already exists');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { username, email, passwordHash, streak: { create: {} } },
    });

    return this.login(user);
  }

  async login(data: any) {
    let user;
    if (data.email && data.password) {
      user = await this.prisma.user.findUnique({ where: { email: data.email } });
      if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
        throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      user = data;
    }

    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, email: user.email }
    };
  }
}
`,
  'src/modules/auth/auth.controller.ts': `import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}
`,
  'src/modules/workouts/workouts.module.ts': `import { Module } from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaService } from '../../prisma.service';
import { StreaksService } from '../streaks/streaks.service';

@Module({
  controllers: [WorkoutsController],
  providers: [WorkoutsService, PrismaService, StreaksService],
})
export class WorkoutsModule {}
`,
  'src/modules/workouts/workouts.service.ts': `import { Injectable } from '@nestjs/common';
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
`,
  'src/modules/workouts/workouts.controller.ts': `import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
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
`,
  'src/modules/streaks/streaks.module.ts': `import { Module } from '@nestjs/common';
import { StreaksService } from './streaks.service';
import { StreaksController } from './streaks.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [StreaksController],
  providers: [StreaksService, PrismaService],
  exports: [StreaksService]
})
export class StreaksModule {}
`,
  'src/modules/streaks/streaks.service.ts': `import { Injectable } from '@nestjs/common';
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
`,
  'src/modules/streaks/streaks.controller.ts': `import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
`,
  'src/modules/stories/stories.module.ts': `import { Module } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { StoriesController } from './stories.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [StoriesController],
  providers: [StoriesService, PrismaService],
})
export class StoriesModule {}
`,
  'src/modules/stories/stories.service.ts': `import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { createCanvas } from 'canvas';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class StoriesService {
  constructor(private prisma: PrismaService) {}

  async generateStory(userId: string, workoutId: string, style: string) {
    const workout = await this.prisma.workout.findFirst({ where: { id: workoutId, userId }, include: { user: { include: { streak: true } } } });
    if (!workout) throw new NotFoundException('Workout not found');

    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');

    // Background based on style
    if (style === 'dark minimal') {
      ctx.fillStyle = '#111';
    } else if (style === 'neon fitness') {
      ctx.fillStyle = '#1A0033';
    } else { // clean white
      ctx.fillStyle = '#FFF';
    }
    ctx.fillRect(0, 0, 1080, 1920);

    // Text color
    ctx.fillStyle = (style === 'clean white') ? '#111' : '#FFF';
    
    // Draw content
    ctx.font = 'bold 120px sans-serif';
    ctx.fillText('STREVO', 100, 300);

    if (style === 'neon fitness') {
      ctx.fillStyle = '#00FFCC';
    }

    ctx.font = '80px sans-serif';
    ctx.fillText(workout.type.toUpperCase(), 100, 600);

    ctx.fillStyle = (style === 'clean white') ? '#444' : '#CCC';
    ctx.font = '60px sans-serif';
    ctx.fillText(\`Duration: \${Math.floor(workout.duration / 60)} min\`, 100, 800);
    ctx.fillText(\`Streak: \${workout.user.streak?.currentStreak || 0} 🔥\`, 100, 950);
    ctx.fillText(\`@\${workout.user.username}\`, 100, 1100);
    
    // Phrase
    ctx.fillStyle = (style === 'neon fitness') ? '#FF007F' : ((style === 'clean white') ? '#111' : '#FFF');
    ctx.font = 'italic 70px sans-serif';
    ctx.fillText('"One day or day one?"', 100, 1500);

    const buffer = canvas.toBuffer('image/png');
    // In MVP, we can save to public folder and serve directly instead of AWS S3
    const publicDir = path.join(__dirname, '..', '..', '..', 'public', 'stories');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const filename = \`\${workoutId}-\${Date.now()}.png\`;
    const filePath = path.join(publicDir, filename);
    fs.writeFileSync(filePath, buffer);

    const imageUrl = \`http://localhost:3000/stories/\${filename}\`;

    await this.prisma.story.create({
      data: {
        userId,
        workoutId,
        imageUrl
      }
    });

    return { imageUrl };
  }
}
`,
  'src/modules/stories/stories.controller.ts': `import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post('generate')
  generate(@Request() req, @Body() body: { workoutId: string, style: string }) {
    return this.storiesService.generateStory(req.user.userId, body.workoutId, body.style);
  }
}
`,
  'src/app.module.ts': `import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { StreaksModule } from './modules/streaks/streaks.module';
import { StoriesModule } from './modules/stories/stories.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    AuthModule,
    WorkoutsModule,
    StreaksModule,
    StoriesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/'
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
`,
  'src/main.ts': `import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3000);
}
bootstrap();
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Backend setup complete');
