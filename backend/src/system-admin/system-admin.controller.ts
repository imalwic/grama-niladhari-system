import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { SystemAdminService } from './system-admin.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('system-admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class SystemAdminController {
  constructor(private readonly systemAdminService: SystemAdminService) {}

  @Get('dashboard-stats')
  @Roles(Role.SUPER_ADMIN)
  async getDashboardStats() {
    return this.systemAdminService.getDashboardStats();
  }

  @Get('pradeshiya-sabhas')
  @Roles(Role.SUPER_ADMIN)
  getPradeshiyaSabhas() {
    return this.systemAdminService.getPradeshiyaSabhas();
  }

  @Post('pradeshiya-sabhas')
  @Roles(Role.SUPER_ADMIN)
  createPradeshiyaSabha(@Body() data: any, @Req() req: any) {
    return this.systemAdminService.createPradeshiyaSabha(data, req.user.id);
  }

  @Get('ps-admins')
  @Roles(Role.SUPER_ADMIN)
  getPsAdmins() {
    return this.systemAdminService.getPsAdmins();
  }

  @Post('ps-admins')
  @Roles(Role.SUPER_ADMIN)
  createPsAdmin(@Body() data: any, @Req() req: any) {
    return this.systemAdminService.createPsAdmin(data, req.user.id);
  }

  @Post('pradeshiya-sabhas/register')
  @Roles(Role.SUPER_ADMIN)
  registerPradeshiyaSabhaWithAdmin(@Body() data: any, @Req() req: any) {
    return this.systemAdminService.registerPradeshiyaSabhaWithAdmin(data, req.user.id);
  }

  @Post('ps-admins/:id/reset-password')
  @Roles(Role.SUPER_ADMIN)
  resetPsAdminPassword(@Param('id') id: string) {
    return this.systemAdminService.resetPsAdminPassword(id);
  }
}
