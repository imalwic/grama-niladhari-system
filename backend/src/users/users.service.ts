import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getGnOfficers(pradeshiyaSabhaId: string) {
    return this.prisma.user.findMany({
      where: { 
        role: 'GN_OFFICER',
        wasama: { pradeshiyaSabhaId }
      },
      include: {
        wasama: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createGnOfficer(data: any, pradeshiyaSabhaId: string) {
    const { name, nic, email, wasamaCode, password } = data;

    // WasamaCode is coming from frontend Select which passes wasama.name
    // Let's find the Wasama in this Pradeshiya Sabha
    let wasama = await this.prisma.wasama.findFirst({
      where: { 
        OR: [{ name: wasamaCode }, { code: wasamaCode }],
        pradeshiyaSabhaId
      }
    });
    
    if (!wasama) {
       throw new BadRequestException('Invalid Wasama or it does not belong to your Pradeshiya Sabha.');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { nic }] }
    });

    if (existingUser) {
      throw new BadRequestException('User with this Email or NIC already exists');
    }

    const hashedPassword = await bcrypt.hash(password || 'password123', 10);

    return this.prisma.user.create({
      data: {
        name,
        nic,
        email,
        passwordHash: hashedPassword,
        role: 'GN_OFFICER',
        wasamaId: wasama.id
      },
      include: { wasama: true }
    });
  }

  async deleteGnOfficer(id: string, pradeshiyaSabhaId: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      include: { wasama: true }
    });
    if (!user || user.role !== 'GN_OFFICER') {
      throw new NotFoundException('GN Officer not found');
    }
    
    if (user.wasama?.pradeshiyaSabhaId !== pradeshiyaSabhaId) {
      throw new BadRequestException('Cannot delete GN officer from another Pradeshiya Sabha');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
