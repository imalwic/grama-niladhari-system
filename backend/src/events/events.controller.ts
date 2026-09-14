import { Controller, Get, Post, Body, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { EventsService } from './events.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // GN Officer Endpoints
  @Post()
  @Roles(Role.GN_OFFICER)
  createEvent(@Body() data: any, @Request() req: any) {
    return this.eventsService.createEvent(data, req.user.wasamaId);
  }

  @Get('gn')
  @Roles(Role.GN_OFFICER)
  getEventsGn(@Request() req: any) {
    return this.eventsService.getEventsByWasama(req.user.wasamaId);
  }

  @Get(':eventId/rsvps')
  @Roles(Role.GN_OFFICER)
  getRsvps(@Param('eventId') eventId: string, @Request() req: any) {
    return this.eventsService.getRsvpsForEvent(eventId, req.user.wasamaId);
  }

  // Resident Endpoints
  @Get('resident')
  @Roles(Role.RESIDENT)
  getEventsResident(@Request() req: any) {
    return this.eventsService.getUpcomingEventsForResident(req.user.residentId);
  }

  @Patch(':eventId/rsvp')
  @Roles(Role.RESIDENT)
  rsvp(@Param('eventId') eventId: string, @Body('status') status: string, @Request() req: any) {
    return this.eventsService.rsvpToEvent(eventId, req.user.residentId, status);
  }
}
