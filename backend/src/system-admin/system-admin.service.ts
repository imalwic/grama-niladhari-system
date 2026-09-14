import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SystemAdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [totalPradeshiyaSabhas, totalGnDivisions, totalResidents, totalPsAdmins, recentActivityRaw, pradeshiyaSabhas] = await Promise.all([
      this.prisma.pradeshiyaSabha.count(),
      this.prisma.wasama.count(),
      this.prisma.resident.count(),
      this.prisma.user.count({ where: { role: 'PS_ADMIN' } }),
      this.prisma.pradeshiyaSabha.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
      }),
      this.prisma.pradeshiyaSabha.findMany({
        include: {
          wasamas: {
            include: {
              households: {
                include: {
                  _count: { select: { residents: true } }
                }
              }
            }
          }
        }
      })
    ]);

    const recentActivity = recentActivityRaw.map(ps => ({
      message: `New Pradeshiya Sabha added: ${ps.name}`,
      time: ps.createdAt
    }));

    const demographics = pradeshiyaSabhas.map(ps => {
      let population = 0;
      ps.wasamas.forEach(w => {
        w.households.forEach(h => {
          population += h._count.residents;
        });
      });
      return {
        name: ps.name,
        population
      };
    });

    return {
      totalPradeshiyaSabhas,
      totalGnDivisions,
      totalResidents,
      totalPsAdmins,
      recentActivity,
      demographics
    };
  }

  async getPradeshiyaSabhas() {
    return this.prisma.pradeshiyaSabha.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { wasamas: true, users: true }
        },
        users: {
          select: { id: true, name: true, email: true, nic: true, phone: true }
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

  async registerPradeshiyaSabhaWithAdmin(data: any) {
    const crypto = require('crypto');
    const bcrypt = require('bcrypt');

    // 1. Check if PS exists, else create
    let ps = await this.prisma.pradeshiyaSabha.findFirst({
      where: { name: data.sabhaName, district: data.district }
    });

    if (!ps) {
      ps = await this.prisma.pradeshiyaSabha.create({
        data: {
          name: data.sabhaName,
          district: data.district,
        }
      });
    }

    // 2. Generate a temporary password (e.g., 8 chars)
    const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 characters
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // 3. Create PS Admin
    const newAdmin = await this.prisma.user.create({
      data: {
        name: data.adminName,
        email: data.adminEmail,
        nic: data.adminNic,
        phone: data.adminPhone,
        passwordHash,
        role: 'PS_ADMIN',
        pradeshiyaSabhaId: ps.id
      }
    });

    return {
      message: 'Registration successful',
      pradeshiyaSabha: ps,
      admin: {
        id: newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
      },
      temporaryPassword: tempPassword // Sent back to UI for QR code
    };
  }

  async resetPsAdminPassword(adminId: string) {
    const crypto = require('crypto');
    const bcrypt = require('bcrypt');

    const admin = await this.prisma.user.findUnique({
      where: { id: adminId, role: 'PS_ADMIN' }
    });

    if (!admin) {
      throw new Error("PS Admin not found");
    }

    const tempPassword = crypto.randomBytes(4).toString('hex');
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    await this.prisma.user.update({
      where: { id: adminId },
      data: { passwordHash }
    });

    return {
      message: 'Password reset successful',
      email: admin.email,
      temporaryPassword: tempPassword
    };
  }
}
