import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('grievances')
export class GrievancesController {
  constructor(private readonly grievancesService: GrievancesService) {}

  // Resident submits a grievance
  @Post('resident')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.RESIDENT)
  async createGrievanceResident(@Body() body: any, @Request() req: any) {
    const payload = {
      ...body,
      residentId: req.user.residentId,
      wasamaId: req.user.wasamaId // User table has wasamaId linked, or if they are Resident, it's inside their residentProfile
    };
    return this.grievancesService.createGrievance(payload);
  }

  // Resident views their own grievances
  @Get('my-grievances')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.RESIDENT)
  async getMyGrievances(@Request() req: any) {
    return this.grievancesService.getResidentGrievances(req.user.residentId);
  }

  // Global Admin views global grievances
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.PS_ADMIN)
  async getAllGrievances() {
    return this.grievancesService.getGlobalAdminGrievances();
  }

  // GN Officer views GN grievances
  @Get('gn')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.GN_OFFICER)
  async getGNGrievances(@Request() req: any) {
    return this.grievancesService.getGNGrievances(req.user.wasamaId);
  }

  // Global Admin or GN Officer updates status
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.PS_ADMIN, Role.GN_OFFICER)
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.grievancesService.updateStatus(id, status);
  }
}
