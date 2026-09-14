import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubsidiesService {
  constructor(private prisma: PrismaService) {}

  async createProgram(data: any, wasamaId: string) {
    return this.prisma.subsidyProgram.create({
      data: {
        ...data,
        wasamaId,
      },
    });
  }

  async getProgramsByWasama(wasamaId: string) {
    return this.prisma.subsidyProgram.findMany({
      where: { wasamaId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { applications: true }
        }
      }
    });
  }

  async getApplicationsForProgram(programId: string, wasamaId: string) {
    // Verify program belongs to wasama
    const program = await this.prisma.subsidyProgram.findFirst({
      where: { id: programId, wasamaId },
    });

    if (!program) throw new NotFoundException('Program not found');

    return this.prisma.subsidyApplication.findMany({
      where: { programId },
      include: {
        household: true
      },
      orderBy: { appliedAt: 'desc' }
    });
  }

  async updateApplicationStatus(applicationId: string, status: string, wasamaId: string) {
    const application = await this.prisma.subsidyApplication.findUnique({
      where: { id: applicationId },
      include: { program: true },
    });

    if (!application || application.program.wasamaId !== wasamaId) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.subsidyApplication.update({
      where: { id: applicationId },
      data: { status },
    });
  }

  // Resident endpoints
  async getAvailableProgramsForResident(residentId: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
      include: { household: true }
    });

    if (!resident || !resident.household) throw new NotFoundException('Resident or household not found');

    return this.prisma.subsidyProgram.findMany({
      where: { 
        wasamaId: resident.household.wasamaId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async applyForProgram(programId: string, residentId: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!resident || !resident.householdId) throw new NotFoundException('Resident or household not found');

    return this.prisma.subsidyApplication.create({
      data: {
        programId,
        householdId: resident.householdId,
        status: 'PENDING',
      },
    });
  }

  async getResidentApplications(residentId: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id: residentId },
    });
    if (!resident || !resident.householdId) return [];

    return this.prisma.subsidyApplication.findMany({
      where: { householdId: resident.householdId },
      include: {
        program: true,
      },
      orderBy: { appliedAt: 'desc' }
    });
  }
}
