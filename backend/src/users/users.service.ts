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

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, phone: true, nic: true, role: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string; phone?: string }) {
    // If email is being updated, check if it's already taken
    if (data.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: data.email, NOT: { id: userId } }
      });
      if (existing) {
        throw new BadRequestException('Email is already taken');
      }
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
      select: { id: true, name: true, email: true, phone: true }
    });
  }

  async updatePassword(userId: string, data: { current: string; new: string }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    
    const isValid = await bcrypt.compare(data.current, user.passwordHash);
    if (!isValid) throw new BadRequestException('Invalid current password');
    
    const newHash = await bcrypt.hash(data.new, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash }
    });
    return { success: true };
  }
}
