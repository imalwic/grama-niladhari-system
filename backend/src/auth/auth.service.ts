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

  async validateUser(identifier: string, pass: string): Promise<any> {
    const isEmail = identifier && identifier.includes('@');
    const user = await this.prisma.user.findUnique({ 
      where: isEmail ? { email: identifier } : { nic: identifier },
      include: {
        wasama: true,
        residentProfile: {
          include: {
            household: {
              include: {
                wasama: true,
              }
            }
          }
        }
      }
    });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    let wasamaId = user.wasamaId;
    let wasamaName = user.wasama?.name || null;
    let householdNo = null;

    if (user.role === 'RESIDENT' && user.residentProfile?.household) {
      wasamaId = user.residentProfile.household.wasamaId;
      wasamaName = user.residentProfile.household.wasama?.name;
      householdNo = user.residentProfile.household.houseNumber;
    }

    const payload = {
      sub: user.id,
      nic: user.nic,
      name: user.name,
      role: user.role,
      wasamaId: wasamaId,
      wasamaName: wasamaName,
      householdNo: householdNo,
      pradeshiyaSabhaId: user.pradeshiyaSabhaId,
      residentId: user.residentId,
      isVerified: user.residentProfile?.isVerified || false,
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
    if (!dto.householdNo) {
      throw new BadRequestException('Household number is required');
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
      let household = await this.prisma.household.findUnique({
        where: {
          houseNumber_wasamaId: {
            houseNumber: dto.householdNo,
            wasamaId: wasama.id,
          },
        },
      });
      if (!household) {
        household = await this.prisma.household.create({
          data: {
            houseNumber: dto.householdNo,
            address: dto.address || 'Pending Address',
            wasamaId: wasama.id,
          }
        });
      }
      householdId = household.id;
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
          householdId: householdId || undefined,
        },
      });

      const user = await prisma.user.create({
        data: {
          nic: dto.nic,
          name: dto.fullName,
          email: dto.email,
          phone: dto.phone,
          passwordHash,
          role: 'RESIDENT',
          residentId: resident.id,
          wasamaId: wasama.id,
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
