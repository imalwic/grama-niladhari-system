import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async logAction(action: string, entityType: string, entityId: string, performedBy: string, details?: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          action,
          entityType,
          entityId,
          performedBy,
          details: details ? JSON.stringify(details) : null,
        }
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}
