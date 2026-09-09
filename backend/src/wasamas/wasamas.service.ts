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
          select: { id: true, name: true, email: true, phone: true }
        },
        _count: {
          select: { households: true }
        }
      }
    });
  }

  async createOfficer(createOfficerDto: any, pradeshiyaSabhaId: string) {
    // Validate the wasama exists and belongs to this PS
    const wasama = await this.prisma.wasama.findFirst({
      where: { id: createOfficerDto.wasamaId, pradeshiyaSabhaId }
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
}
