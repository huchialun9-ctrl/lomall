import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { GatewayModule } from './gateway/gateway.module';
import { GuildsModule } from './guilds/guilds.module';

@Module({
  imports: [PrismaModule, AuthModule, TicketsModule, GatewayModule, GuildsModule],
})
export class AppModule {}
