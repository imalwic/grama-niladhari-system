import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GrievancesService {
  constructor(private prisma: PrismaService) {}

  async createGrievance(data: any) {
    return this.prisma.grievance.create({
      data: {
        subject: data.subject,
        description: data.description,
        identityType: data.identityType,
        identityNumber: data.identityNumber,
        reportedBy: data.reportedBy,
        contactInfo: data.contactInfo,
        status: 'PENDING',
        assignedTo: data.assignedTo || 'GLOBAL_ADMIN',
        wasamaId: data.wasamaId,
        residentId: data.residentId
      }
    });
  }

  async getGlobalAdminGrievances() {
    return this.prisma.grievance.findMany({
      where: { assignedTo: 'GLOBAL_ADMIN' },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getGNGrievances(wasamaId: string) {
    return this.prisma.grievance.findMany({
      where: { assignedTo: 'GN_OFFICER', wasamaId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getResidentGrievances(residentId: string) {
    return this.prisma.grievance.findMany({
      where: { residentId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: string) {
    const grievance = await this.prisma.grievance.findUnique({ where: { id } });
    if (!grievance) {
      throw new NotFoundException('Grievance not found');
    }
    return this.prisma.grievance.update({
      where: { id },
      data: { status }
    });
  }
}
