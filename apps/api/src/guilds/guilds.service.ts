import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_GUILD_SETTINGS } from '@lomall/shared';

@Injectable()
export class GuildsService {
  constructor(private prisma: PrismaService) {}

  async findByDiscordId(discordId: string) {
    return this.prisma.guild.findUnique({ where: { discordId } });
  }

  async setup(discordId: string, name: string, icon?: string) {
    return this.prisma.guild.upsert({
      where: { discordId },
      update: { name, icon },
      create: {
        discordId,
        name,
        icon,
        settings: DEFAULT_GUILD_SETTINGS,
      },
    });
  }

  async updateSettings(discordId: string, settings: any) {
    const guild = await this.prisma.guild.findUnique({ where: { discordId } });
    if (!guild) throw new NotFoundException('Guild not found');

    return this.prisma.guild.update({
      where: { discordId },
      data: { settings: { ...(guild.settings as any), ...settings } },
    });
  }

  async getAuditLogs(guildId: string) {
    return this.prisma.auditLog.findMany({
      where: { guild: { discordId: guildId } },
      include: { user: true, ticket: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}
