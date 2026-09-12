import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { SupportService } from './support.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('support')
@UseGuards(AuthGuard('jwt'))
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  createTicket(@Request() req, @Body() body: { subject: string; message: string }) {
    return this.supportService.createTicket(req.user.userId, body.subject, body.message);
  }

  @Get()
  getUserTickets(@Request() req) {
    return this.supportService.getUserTickets(req.user.userId);
  }
}
