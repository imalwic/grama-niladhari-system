import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as csvParser from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class HouseholdsService {
  constructor(private prisma: PrismaService) {}

  async create(createHouseholdDto: any, wasamaId: string) {
    return this.prisma.household.create({
      data: {
        houseNumber: createHouseholdDto.houseNumber,
        address: createHouseholdDto.address,
        wasamaId: wasamaId,
      },
    });
  }

  async bulkImport(fileBuffer: Buffer, wasamaId: string) {
    const results = [];
    return new Promise((resolve, reject) => {
      Readable.from(fileBuffer)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            // Bulk insert
            const formattedData = results.map(row => ({
              houseNumber: row.houseNumber,
              address: row.address,
              wasamaId: wasamaId
            }));
            await this.prisma.household.createMany({
              data: formattedData,
              skipDuplicates: true
            });
            resolve({ success: true, count: formattedData.length });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  async findAllByWasama(wasamaId: string) {
    return this.prisma.household.findMany({
      where: { wasamaId },
      include: {
        _count: {
          select: { residents: true },
        },
      },
    });
  }

  async findOne(id: string, wasamaId: string) {
    const household = await this.prisma.household.findFirst({
      where: { id, wasamaId },
      include: { residents: true },
    });
    if (!household) {
      throw new NotFoundException('Household not found in your Wasama');
    }
    return household;
  }

  async update(id: string, updateHouseholdDto: any, wasamaId: string) {
    // First verify it exists in their wasama
    await this.findOne(id, wasamaId);
    return this.prisma.household.update({
      where: { id },
      data: updateHouseholdDto,
    });
  }

  async remove(id: string, wasamaId: string) {
    await this.findOne(id, wasamaId);
    return this.prisma.household.delete({
      where: { id },
    });
  }
}
