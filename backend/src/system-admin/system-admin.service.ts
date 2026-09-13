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

  async getPradeshiyaSabhas() {
    return this.prisma.pradeshiyaSabha.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { wasamas: true, users: true }
        }
      }
    });
  }

  async createPradeshiyaSabha(data: any) {
    return this.prisma.pradeshiyaSabha.create({
      data: {
        name: data.name,
        district: data.district,
      }
    });
  }

  async getPsAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'PS_ADMIN' },
      include: { pradeshiyaSabha: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPsAdmin(data: any) {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        nic: data.nic,
        passwordHash,
        role: 'PS_ADMIN',
        pradeshiyaSabhaId: data.pradeshiyaSabhaId
      }
    });
  }
}
