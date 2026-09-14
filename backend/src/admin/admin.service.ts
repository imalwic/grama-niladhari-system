import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(pradeshiyaSabhaId: string) {
    if (!pradeshiyaSabhaId) {
       return { totalResidents: 0, totalHouseholds: 0, gnDivisions: 0, pendingRequests: 0, recentActivity: [] };
    }

    const [totalResidents, totalHouseholds, gnDivisions, pendingRequests, recentActivityRaw, allResidents] = await Promise.all([
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
      }),
      this.prisma.resident.findMany({
        where: { household: { wasama: { pradeshiyaSabhaId } } },
        select: { dateOfBirth: true, relationshipToHead: true }
      })
    ]);

    const recentActivity = recentActivityRaw.map(r => ({
      message: `Resident registered in ${r.household?.wasama?.name || 'Unknown Division'}`,
      time: r.createdAt
    }));

    // Demographics Calculation
    const currentYear = new Date().getFullYear();
    let ageDemographics = [
      { name: '0-18', value: 0 },
      { name: '19-35', value: 0 },
      { name: '36-60', value: 0 },
      { name: '60+', value: 0 },
    ];
    let relationshipDemographics: Record<string, number> = {};

    allResidents.forEach(res => {
      const age = currentYear - res.dateOfBirth.getFullYear();
      if (age <= 18) ageDemographics[0].value++;
      else if (age <= 35) ageDemographics[1].value++;
      else if (age <= 60) ageDemographics[2].value++;
      else ageDemographics[3].value++;

      const rel = res.relationshipToHead || 'Other';
      relationshipDemographics[rel] = (relationshipDemographics[rel] || 0) + 1;
    });

    const relationships = Object.keys(relationshipDemographics).map(key => ({
      name: key,
      value: relationshipDemographics[key]
    }));

    return {
      totalResidents,
      totalHouseholds,
      gnDivisions,
      pendingRequests,
      recentActivity,
      ageDemographics,
      relationships
    };
  }
}
