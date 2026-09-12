import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getGnOfficers() {
    return this.prisma.user.findMany({
      where: { role: 'GN_OFFICER' },
      include: {
        wasama: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createGnOfficer(data: any) {
    const { name, nic, email, wasamaCode, password } = data;

    // Optional: Find Wasama by code/name
    let wasama = await this.prisma.wasama.findFirst({
      where: { name: wasamaCode }
    });
    
    // Fallback: If not found, try by code or just take the first one or create dummy
    if (!wasama) {
       wasama = await this.prisma.wasama.findFirst();
       if (!wasama) {
          throw new BadRequestException('No Wasama found in the system. Please create a Wasama first.');
       }
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

  async deleteGnOfficer(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.role !== 'GN_OFFICER') {
      throw new NotFoundException('GN Officer not found');
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
