import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(discordProfile: {
    discordId: string;
    username: string;
    avatar?: string;
    email?: string;
    accessToken: string;
    refreshToken: string;
  }) {
    const user = await this.prisma.user.upsert({
      where: { discordId: discordProfile.discordId },
      update: {
        username: discordProfile.username,
        avatar: discordProfile.avatar,
        email: discordProfile.email,
        accessToken: discordProfile.accessToken,
        refreshToken: discordProfile.refreshToken,
      },
      create: {
        discordId: discordProfile.discordId,
        username: discordProfile.username,
        avatar: discordProfile.avatar,
        email: discordProfile.email,
        accessToken: discordProfile.accessToken,
        refreshToken: discordProfile.refreshToken,
      },
    });

    const token = this.jwt.sign({ sub: user.id });

    return { token, user };
  }
}
