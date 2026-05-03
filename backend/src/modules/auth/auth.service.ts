import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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
