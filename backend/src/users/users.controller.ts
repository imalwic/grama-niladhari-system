import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
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
  getGnOfficers() {
    return this.usersService.getGnOfficers();
  }

  @Post('gn-officers')
  @Roles(Role.SUPER_ADMIN)
  createGnOfficer(@Body() data: any) {
    return this.usersService.createGnOfficer(data);
  }

  @Delete('gn-officers/:id')
  @Roles(Role.SUPER_ADMIN)
  deleteGnOfficer(@Param('id') id: string) {
    return this.usersService.deleteGnOfficer(id);
  }
}
