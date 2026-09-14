import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WasamasService {
  constructor(private prisma: PrismaService) {}

  async createWasama(createWasamaDto: any, pradeshiyaSabhaId: string) {
    return this.prisma.wasama.create({
      data: {
        name: createWasamaDto.name,
        code: createWasamaDto.code,
        pradeshiyaSabhaId: pradeshiyaSabhaId,
      },
    });
  }

  async findAllWasamas(pradeshiyaSabhaId: string) {
    return this.prisma.wasama.findMany({
      where: { pradeshiyaSabhaId },
      include: {
        officers: {
          select: { id: true, name: true, email: true, phone: true },
        },
        _count: {
          select: { households: true },
        },
      },
    });
  }

  async createOfficer(createOfficerDto: any, pradeshiyaSabhaId: string) {
    // Validate the wasama exists and belongs to this PS
    const wasama = await this.prisma.wasama.findFirst({
      where: { id: createOfficerDto.wasamaId, pradeshiyaSabhaId },
    });
    if (!wasama) {
      throw new NotFoundException('Wasama not found in your Pradeshiya Sabha');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createOfficerDto.password, salt);

    return this.prisma.user.create({
      data: {
        nic: createOfficerDto.nic,
        name: createOfficerDto.name,
        email: createOfficerDto.email,
        phone: createOfficerDto.phone,
        passwordHash,
        role: 'GN_OFFICER',
        wasamaId: createOfficerDto.wasamaId,
      },
    });
  }

  async getDashboardStats(wasamaId: string) {
    const currentYear = new Date().getFullYear();
    const startOf18YearsAgo = new Date(currentYear - 18, 0, 1);
    const endOf18YearsAgo = new Date(currentYear - 18, 11, 31, 23, 59, 59);

    const [totalHouseholds, totalResidents, newVoters, pendingRequests, issuedCertificates] = await Promise.all([
      this.prisma.household.count({ where: { wasamaId } }),
      this.prisma.resident.count({ where: { household: { wasamaId } } }),
      this.prisma.resident.count({
        where: {
          household: { wasamaId },
          dateOfBirth: {
            gte: startOf18YearsAgo,
            lte: endOf18YearsAgo
          }
        }
      }),
      this.prisma.request.count({
        where: {
          resident: { household: { wasamaId } },
          status: 'PENDING'
        }
      }),
      this.prisma.request.count({
        where: {
          resident: { household: { wasamaId } },
          status: 'APPROVED'
        }
      })
    ]);

    // Calculate Age Groups (0-18, 19-35, 36-60, 60+)
    const allResidents = await this.prisma.resident.findMany({
      where: { household: { wasamaId } },
      select: { dateOfBirth: true, relationshipToHead: true }
    });

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
      totalHouseholds,
      totalResidents,
      newVoters,
      pendingRequests,
      issuedCertificates,
      ageDemographics,
      relationships
    };
  }
}
