import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class SystemAdminService {
  constructor(private prisma: PrismaService, private audit: AuditService) {}

  async getDashboardStats() {
    const currentYear = new Date().getFullYear();
    const startOf18YearsAgo = new Date(currentYear - 18, 0, 1);
    const endOf18YearsAgo = new Date(currentYear - 18, 11, 31, 23, 59, 59);

    const [totalPradeshiyaSabhas, totalGnDivisions, totalResidents, totalPsAdmins, recentActivityRaw, pradeshiyaSabhas, categoriesRaw, psWithRequestsRaw, newVoters, householdsRaw, pendingGrievances] = await Promise.all([
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
      }),
      this.prisma.category.findMany({
        include: {
          _count: { select: { residents: true } }
        }
      }),
      this.prisma.pradeshiyaSabha.findMany({
        include: {
          wasamas: {
            include: {
              households: {
                include: {
                  residents: {
                    include: {
                      _count: {
                        select: { requests: { where: { status: 'PENDING' } } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      this.prisma.resident.count({
        where: {
          dateOfBirth: {
            gte: startOf18YearsAgo,
            lte: endOf18YearsAgo
          }
        }
      }),
      this.prisma.household.findMany({
        include: {
          _count: { select: { residents: true } },
          wasama: {
            include: { pradeshiyaSabha: true }
          }
        }
      }),
      this.prisma.grievance.count({
        where: { status: 'PENDING' }
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

    const categoryStats = categoriesRaw.map(c => ({
      name: c.name,
      count: c._count.residents
    }));

    const bottlenecks = psWithRequestsRaw.map(ps => {
      let pendingCount = 0;
      ps.wasamas.forEach(w => {
        w.households.forEach(h => {
          h.residents.forEach(r => {
            pendingCount += r._count.requests;
          });
        });
      });
      return {
        name: ps.name,
        pendingRequests: pendingCount
      };
    }).sort((a, b) => b.pendingRequests - a.pendingRequests).slice(0, 5);

    const anomalies = householdsRaw
      .filter(h => h._count.residents > 10)
      .map(h => ({
        householdNo: h.houseNumber,
        wasamaName: h.wasama?.name || 'Unknown',
        pradeshiyaSabhaName: h.wasama?.pradeshiyaSabha?.name || 'Unknown',
        residentCount: h._count.residents
      }))
      .slice(0, 10);

    return {
      totalPradeshiyaSabhas,
      totalGnDivisions,
      totalResidents,
      totalPsAdmins,
      recentActivity,
      demographics,
      categoryStats,
      bottlenecks,
      newVoters,
      pendingGrievances,
      anomalies
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

  async createPradeshiyaSabha(data: any, userId?: string) {
    const ps = await this.prisma.pradeshiyaSabha.create({
      data: {
        name: data.name,
        district: data.district,
      }
    });
    if (userId) {
      await this.audit.logAction('CREATE_PRADESHIYA_SABHA', 'PradeshiyaSabha', ps.id, userId, { name: ps.name });
    }
    return ps;
  }

  async getPsAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'PS_ADMIN' },
      include: { pradeshiyaSabha: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createPsAdmin(data: any, userId?: string) {
    const bcrypt = require('bcrypt');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newAdmin = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        nic: data.nic,
        passwordHash,
        role: 'PS_ADMIN',
        pradeshiyaSabhaId: data.pradeshiyaSabhaId
      }
    });
    if (userId) {
      await this.audit.logAction('CREATE_PS_ADMIN', 'User', newAdmin.id, userId, { email: newAdmin.email });
    }
    return newAdmin;
  }

  async registerPradeshiyaSabhaWithAdmin(data: any, userId?: string) {
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

    if (userId) {
      await this.audit.logAction('REGISTER_PS_WITH_ADMIN', 'PradeshiyaSabha', ps.id, userId, { psName: ps.name, adminEmail: newAdmin.email });
    }

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
