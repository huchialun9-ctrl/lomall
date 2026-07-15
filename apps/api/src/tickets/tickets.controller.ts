import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TicketsService } from './tickets.service';
import { CreateTicketDto, SendMessageDto } from '@lomall/shared';
import { GatewayService } from '../gateway/gateway.service';

@Controller('tickets')
@UseGuards(AuthGuard('jwt'))
export class TicketsController {
  constructor(
    private tickets: TicketsService,
    private gateway: GatewayService,
  ) {}

  @Get()
  findAll(@Query('guildId') guildId: string, @Query('status') status?: string) {
    return this.tickets.findAll(guildId, status);
  }

  @Get('channel/:channelId')
  findByChannel(@Param('channelId') channelId: string) {
    return this.tickets.findByChannelId(channelId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tickets.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateTicketDto, @Req() req: any) {
    const ticket = await this.tickets.create({ ...dto, userId: req.user.id });
    this.gateway.emitTicketCreated(ticket);
    return ticket;
  }

  @Patch(':id/close')
  async close(@Param('id') id: string, @Req() req: any) {
    const ticket = await this.tickets.close(id, req.user.id);
    this.gateway.emitTicketUpdated(ticket);
    return ticket;
  }

  @Patch(':id/reopen')
  async reopen(@Param('id') id: string, @Req() req: any) {
    const ticket = await this.tickets.reopen(id, req.user.id);
    this.gateway.emitTicketUpdated(ticket);
    return ticket;
  }

  @Patch(':id/assign')
  async assign(@Param('id') id: string, @Body('assignedTo') assignedTo: string, @Req() req: any) {
    const ticket = await this.tickets.assign(id, assignedTo, req.user.id);
    this.gateway.emitTicketUpdated(ticket);
    return ticket;
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() dto: SendMessageDto, @Req() req: any) {
    const message = await this.tickets.sendMessage(id, { ...dto, userId: req.user.id });
    this.gateway.emitMessageCreated(id, message);
    return message;
  }

  @Get(':id/messages')
  getMessages(@Param('id') id: string) {
    return this.tickets.getMessages(id);
  }

  @Patch(':id/channel')
  updateChannel(@Param('id') id: string, @Body('channelId') channelId: string) {
    return this.tickets.updateChannel(id, channelId);
  }
}
