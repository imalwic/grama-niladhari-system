import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: any, wasamaId: string) {
    // Ensure the household belongs to the GN officer's wasama
    const household = await this.prisma.household.findFirst({
      where: { id: createResidentDto.householdId, wasamaId },
    });
    if (!household) {
      throw new NotFoundException('Household not found in your Wasama');
    }

    return this.prisma.resident.create({
      data: {
        nic: createResidentDto.nic,
        fullName: createResidentDto.fullName,
        dateOfBirth: new Date(createResidentDto.dateOfBirth),
        relationshipToHead: createResidentDto.relationshipToHead,
        isHeadOfHousehold: createResidentDto.isHeadOfHousehold,
        phone: createResidentDto.phone,
        householdId: createResidentDto.householdId,
        consentGiven: createResidentDto.consentGiven,
        consentDate: createResidentDto.consentGiven ? new Date() : null,
      },
    });
  }

  async findAllByWasama(wasamaId: string) {
    return this.prisma.resident.findMany({
      where: {
        household: { wasamaId }
      },
      include: {
        household: true,
        categoryTags: { include: { category: true } }
      }
    });
  }

  async findOne(id: string, wasamaId: string) {
    const resident = await this.prisma.resident.findFirst({
      where: { 
        id, 
        household: { wasamaId } 
      },
      include: { household: true, categoryTags: { include: { category: true } } },
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

  async remove(id: string, wasamaId: string) {
    await this.findOne(id, wasamaId); // Verify access
    return this.prisma.resident.delete({
      where: { id },
    });
  }
}
