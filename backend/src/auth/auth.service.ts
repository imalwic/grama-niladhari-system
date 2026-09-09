import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { ConflictException, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(nic: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { nic } });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      nic: user.nic,
      role: user.role,
      wasamaId: user.wasamaId,
      pradeshiyaSabhaId: user.pradeshiyaSabhaId,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    };
  }

  async registerResident(dto: any) {
    if (!dto.consentGiven) {
      throw new BadRequestException('PDPA consent is required');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { nic: dto.nic },
    });

    if (existingUser) {
      throw new ConflictException('A user with this NIC already exists');
    }

    // Find Wasama by code
    const wasama = await this.prisma.wasama.findUnique({
      where: { code: dto.wasamaCode },
    });

    if (!wasama) {
      throw new BadRequestException('Invalid Grama Niladhari Division');
    }

    // Attempt to find household, but it's optional for the registration
    let householdId = null;
    if (dto.householdNo) {
      const household = await this.prisma.household.findUnique({
        where: {
          houseNumber_wasamaId: {
            houseNumber: dto.householdNo,
            wasamaId: wasama.id,
          },
        },
      });
      if (household) {
        householdId = household.id;
      }
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create Resident and User in a transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      const resident = await prisma.resident.create({
        data: {
          nic: dto.nic,
          fullName: dto.fullName,
          dateOfBirth: new Date(dto.dob),
          relationshipToHead: 'Resident', // Default
          phone: dto.phone,
          consentGiven: dto.consentGiven,
          consentDate: new Date(),
          isVerified: false,
          householdId: householdId,
        },
      });

      const user = await prisma.user.create({
        data: {
          nic: dto.nic,
          name: dto.fullName,
          phone: dto.phone,
          passwordHash,
          role: 'RESIDENT',
          residentId: resident.id,
        },
      });

      return { user, resident };
    });

    return {
      message: 'Registration successful. Waiting for GN Officer verification.',
      userId: result.user.id,
    };
  }
}
