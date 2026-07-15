import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Get('discord')
  @UseGuards(AuthGuard('discord'))
  discordLogin() {}

  @Get('discord/callback')
  @UseGuards(AuthGuard('discord'))
  async discordCallback(@Req() req: any, @Res() res: Response) {
    const result = await this.auth.login(req.user);
    const webUrl = process.env.WEB_URL || 'http://localhost:3000';
    res.redirect(`${webUrl}/login?token=${result.token}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    return req.user;
  }
}
