import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemAdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPradeshiyaSabhas, totalGnDivisions, totalResidents, totalPsAdmins, recentActivityRaw] = await Promise.all([
      this.prisma.pradeshiyaSabha.count(),
      this.prisma.wasama.count(),
      this.prisma.resident.count(),
      this.prisma.user.count({ where: { role: 'PS_ADMIN' } }),
      this.prisma.pradeshiyaSabha.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    const recentActivity = recentActivityRaw.map(ps => ({
      message: `New Pradeshiya Sabha added: ${ps.name}`,
      time: ps.createdAt
    }));

    return {
      totalPradeshiyaSabhas,
      totalGnDivisions,
      totalResidents,
      totalPsAdmins,
      recentActivity
    };
  }
}
