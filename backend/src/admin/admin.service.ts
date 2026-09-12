import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(pradeshiyaSabhaId: string) {
    if (!pradeshiyaSabhaId) {
       return { totalResidents: 0, totalHouseholds: 0, gnDivisions: 0, pendingRequests: 0, recentActivity: [] };
    }

    const [totalResidents, totalHouseholds, gnDivisions, pendingRequests, recentActivityRaw] = await Promise.all([
      this.prisma.resident.count({
        where: { household: { wasama: { pradeshiyaSabhaId } } }
      }),
      this.prisma.household.count({
        where: { wasama: { pradeshiyaSabhaId } }
      }),
      this.prisma.wasama.count({
        where: { pradeshiyaSabhaId }
      }),
      this.prisma.request.count({ 
        where: { status: 'PENDING', resident: { household: { wasama: { pradeshiyaSabhaId } } } } 
      }),
      this.prisma.resident.findMany({
        where: { household: { wasama: { pradeshiyaSabhaId } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { household: { include: { wasama: true } } }
      })
    ]);

    const recentActivity = recentActivityRaw.map(r => ({
      message: `Resident registered in ${r.household?.wasama?.name || 'Unknown Division'}`,
      time: r.createdAt
    }));

    return {
      totalResidents,
      totalHouseholds,
      gnDivisions,
      pendingRequests,
      recentActivity
    };
  }
}
