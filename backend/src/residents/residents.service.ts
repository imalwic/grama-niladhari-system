import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: any, wasamaId: string) {
    let householdId = createResidentDto.householdId;

    if (!householdId && createResidentDto.householdNo) {
      let household = await this.prisma.household.findUnique({
        where: {
          houseNumber_wasamaId: {
            houseNumber: createResidentDto.householdNo,
            wasamaId,
          }
        }
      });

      if (!household) {
        household = await this.prisma.household.create({
          data: {
            houseNumber: createResidentDto.householdNo,
            address: 'Pending Address',
            wasamaId,
          }
        });
      }
      householdId = household.id;
    }

    if (!householdId) {
      throw new NotFoundException('Household information is required');
    }

    return this.prisma.resident.create({
      data: {
        nic: createResidentDto.nic,
        fullName: createResidentDto.fullName,
        dateOfBirth: createResidentDto.dateOfBirth ? new Date(createResidentDto.dateOfBirth) : new Date(),
        relationshipToHead: createResidentDto.relationshipToHead || 'Resident',
        isHeadOfHousehold: createResidentDto.isHeadOfHousehold || false,
        phone: createResidentDto.phone,
        gender: createResidentDto.gender,
        maritalStatus: createResidentDto.maritalStatus,
        occupation: createResidentDto.occupation,
        highestEducation: createResidentDto.highestEducation,
        religion: createResidentDto.religion,
        householdId: householdId,
        consentGiven: createResidentDto.consentGiven || true,
        consentDate: new Date(),
        isVerified: true, // Auto verify when GN officer adds them
      },
    });
  }

  async findAllByWasama(wasamaId: string) {
    return this.prisma.resident.findMany({
      where: {
        household: { wasamaId },
      },
      include: {
        household: true,
        categoryTags: { include: { category: true } },
      },
    });
  }

  async findVotersByWasama(wasamaId: string) {
    const currentYear = new Date().getFullYear();
    const startOf18YearsAgo = new Date(currentYear - 18, 11, 31, 23, 59, 59);

    return this.prisma.resident.findMany({
      where: {
        household: { wasamaId },
        dateOfBirth: {
          lte: startOf18YearsAgo
        }
      },
      include: {
        household: true
      },
      orderBy: {
        fullName: 'asc'
      }
    });
  }

  async findOne(id: string, wasamaId: string) {
    const resident = await this.prisma.resident.findFirst({
      where: {
        id,
        household: { wasamaId },
      },
      include: {
        household: true,
        categoryTags: { include: { category: true } },
      },
    });
    if (!resident) {
      throw new NotFoundException('Resident not found in your Wasama');
    }
    return resident;
  }

  async update(id: string, updateResidentDto: any, wasamaId: string) {
    await this.findOne(id, wasamaId); // Verify access
    return this.prisma.resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  async approve(id: string, wasamaId: string, householdId?: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: { household: true },
    });

    if (!resident) {
      throw new NotFoundException('Resident not found');
    }

    // Since the resident might not have a household yet (pending), we can't use findOne logic directly
    // Instead we check if they are requesting a household in this wasama
    if (resident.householdId) {
      if (resident.household?.wasamaId !== wasamaId) {
        throw new NotFoundException('Resident household belongs to a different Wasama');
      }
    }

    // Update the resident to verified, optionally setting the household
    return this.prisma.resident.update({
      where: { id },
      data: {
        isVerified: true,
        ...(householdId && { householdId }),
      },
    });
  }

  async remove(id: string, wasamaId: string) {
    await this.findOne(id, wasamaId); // Verify access
    return this.prisma.resident.delete({
      where: { id },
    });
  }
}
