import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(nic: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { nic } });
    if (user && await bcrypt.compare(pass, user.passwordHash)) {
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
        pradeshiyaSabhaId: user.pradeshiyaSabhaId
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
  }
}
