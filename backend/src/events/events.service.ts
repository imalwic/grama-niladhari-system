import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async createEvent(data: any, wasamaId: string) {
    return this.prisma.communityEvent.create({
      data: {
        ...data,
        wasamaId,
      },
    });
  }

  async getEventsByWasama(wasamaId: string) {
    return this.prisma.communityEvent.findMany({
      where: { wasamaId },
      orderBy: { eventDate: 'asc' },
      include: {
        _count: {
          select: { rsvps: true }
        }
      }
    });
  }

  async getRsvpsForEvent(eventId: string, wasamaId: string) {
    const event = await this.prisma.communityEvent.findFirst({
      where: { id: eventId, wasamaId },
    });

    if (!event) throw new NotFoundException('Event not found');

    return this.prisma.eventRSVP.findMany({
      where: { eventId },
      include: {
        resident: {
          include: { household: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Resident endpoints
  async getUpcomingEventsForResident(residentId: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
      include: { household: true }
    });

    if (!resident || !resident.household) throw new NotFoundException('Resident or household not found');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return this.prisma.communityEvent.findMany({
      where: { 
        wasamaId: resident.household.wasamaId,
        eventDate: { gte: today }
      },
      orderBy: { eventDate: 'asc' },
      include: {
        rsvps: {
          where: { residentId }
        }
      }
    });
  }

  async rsvpToEvent(eventId: string, residentId: string, status: string) {
    return this.prisma.eventRSVP.upsert({
      where: {
        eventId_residentId: {
          eventId,
          residentId
        }
      },
      update: { status },
      create: {
        eventId,
        residentId,
        status,
      }
    });
  }
}
