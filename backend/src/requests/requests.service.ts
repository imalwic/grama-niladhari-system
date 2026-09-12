import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService
  ) {}

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

  async findByIdWithDetails(id: string) {
    return this.prisma.request.findUnique({
      where: { id },
      include: {
        resident: {
          include: {
            household: {
              include: { wasama: true }
            }
          }
        }
      }
    });
  }

  async findByToken(token: string) {
    return this.prisma.request.findUnique({
      where: { qrCodeToken: token },
      include: {
        resident: {
          select: { fullName: true, nic: true }
        }
      }
    });
  }

  async updateStatus(id: string, status: any, gnOfficerId: string, notes?: string) {
    let certificateUrl = null;
    let qrCodeToken = null;

    if (status === 'APPROVED') {
      certificateUrl = `/certificates/certificate-${id}.pdf`;
      qrCodeToken = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }

    const updatedRequest = await this.prisma.request.update({
      where: { id },
      data: {
        status,
        reviewedById: gnOfficerId,
        reviewNotes: notes,
        ...(status === 'APPROVED' ? { certificateUrl, qrCodeToken } : {})
      },
      include: { resident: { include: { userAccount: true } } }
    });

    // Fire notification
    const userId = updatedRequest.resident.userAccount?.id;
    if (userId) {
       await this.notificationsService.createNotification(
         userId,
         `Request ${status}`,
         `Your request for ${updatedRequest.requestType} has been ${status}. ${notes ? `Notes: ${notes}` : ''}`,
         status === 'APPROVED' ? 'SUCCESS' : status === 'REJECTED' ? 'ERROR' : 'INFO'
       );
    }
    
    return updatedRequest;
  }
}
