import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NoticesService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, wasamaId: string, publishedById: string) {
    return this.prisma.notice.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type || 'GENERAL',
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        wasamaId,
        publishedById,
      },
    });
  }

  async findAllForGnOfficer(wasamaId: string) {
    return this.prisma.notice.findMany({
      where: { wasamaId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAllForResident(wasamaId: string) {
    // Only return active notices (not expired)
    return this.prisma.notice.findMany({
      where: {
        wasamaId,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string, wasamaId: string) {
    const notice = await this.prisma.notice.findFirst({
      where: { id, wasamaId },
    });
    if (!notice) {
      throw new NotFoundException('Notice not found or unauthorized');
    }
    return this.prisma.notice.delete({
      where: { id },
    });
  }
}
