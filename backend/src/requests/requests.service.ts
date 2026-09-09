import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, residentId: string) {
    return this.prisma.request.create({
      data: {
        requestType: data.requestType,
        reason: data.reason,
        residentId,
      },
    });
  }

  async findAllForResident(residentId: string) {
    return this.prisma.request.findMany({
      where: { residentId },
      orderBy: { createdAt: 'desc' },
      include: {
        resident: {
          select: { fullName: true, nic: true }
        }
      }
    });
  }

  async findAllForGnOfficer(wasamaId: string) {
    return this.prisma.request.findMany({
      where: {
        resident: {
          household: {
            wasamaId
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        resident: {
          select: { fullName: true, nic: true, household: { select: { houseNumber: true } } }
        }
      }
    });
  }

  async updateStatus(id: string, status: any, gnOfficerId: string, notes?: string) {
    let certificateUrl = null;
    let qrCodeToken = null;

    // Simulate PDF Generation logic
    if (status === 'APPROVED') {
      certificateUrl = `/certificates/certificate-${id}.pdf`;
      qrCodeToken = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    return this.prisma.request.update({
      where: { id },
      data: {
        status,
        reviewedById: gnOfficerId,
        reviewNotes: notes,
        ...(status === 'APPROVED' ? { certificateUrl, qrCodeToken } : {})
      },
    });
  }
}
