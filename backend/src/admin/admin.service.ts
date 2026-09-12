import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalResidents, totalHouseholds, gnDivisions, pendingRequests, recentActivityRaw] = await Promise.all([
      this.prisma.resident.count(),
      this.prisma.household.count(),
      this.prisma.wasama.count(),
      this.prisma.request.count({ where: { status: 'PENDING' } }),
      this.prisma.resident.findMany({
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
