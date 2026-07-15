import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GuildsService } from './guilds.service';

@Controller('guilds')
@UseGuards(AuthGuard('jwt'))
export class GuildsController {
  constructor(private guilds: GuildsService) {}

  @Get(':discordId')
  findOne(@Param('discordId') discordId: string) {
    return this.guilds.findByDiscordId(discordId);
  }

  @Post(':discordId/setup')
  setup(@Param('discordId') discordId: string, @Body() body: { name: string; icon?: string }) {
    return this.guilds.setup(discordId, body.name, body.icon);
  }

  @Put(':discordId/settings')
  updateSettings(@Param('discordId') discordId: string, @Body() settings: any) {
    return this.guilds.updateSettings(discordId, settings);
  }

  @Get(':discordId/audit-logs')
  getAuditLogs(@Param('discordId') guildId: string) {
    return this.guilds.getAuditLogs(guildId);
  }
}
