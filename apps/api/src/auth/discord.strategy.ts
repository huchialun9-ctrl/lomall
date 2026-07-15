import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-discord';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor() {
    super({
      clientID: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      callbackURL: `${process.env.NEXT_PUBLIC_API_URL}/auth/discord/callback`,
      scope: ['identify', 'email', 'guilds'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    return {
      discordId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      email: profile.email,
      accessToken,
      refreshToken,
    };
  }
}
