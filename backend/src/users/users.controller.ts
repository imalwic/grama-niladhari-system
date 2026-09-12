import { Controller, Get, Post, Delete, Param, Body, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('gn-officers')
  @Roles(Role.SUPER_ADMIN)
  getGnOfficers(@Request() req: any) {
    if (!req.user.pradeshiyaSabhaId) throw new UnauthorizedException('Super admin is not assigned to a Pradeshiya Sabha');
    return this.usersService.getGnOfficers(req.user.pradeshiyaSabhaId);
  }

  @Post('gn-officers')
  @Roles(Role.SUPER_ADMIN)
  createGnOfficer(@Body() data: any, @Request() req: any) {
    if (!req.user.pradeshiyaSabhaId) throw new UnauthorizedException('Super admin is not assigned to a Pradeshiya Sabha');
    return this.usersService.createGnOfficer(data, req.user.pradeshiyaSabhaId);
  }

  @Delete('gn-officers/:id')
  @Roles(Role.SUPER_ADMIN)
  deleteGnOfficer(@Param('id') id: string, @Request() req: any) {
    if (!req.user.pradeshiyaSabhaId) throw new UnauthorizedException('Super admin is not assigned to a Pradeshiya Sabha');
    return this.usersService.deleteGnOfficer(id, req.user.pradeshiyaSabhaId);
  }
}
