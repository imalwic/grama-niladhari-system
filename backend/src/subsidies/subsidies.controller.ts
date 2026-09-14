import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { SubsidiesService } from './subsidies.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('subsidies')
export class SubsidiesController {
  constructor(private readonly subsidiesService: SubsidiesService) {}

  // GN Officer Endpoints
  @Post('programs')
  @Roles(Role.GN_OFFICER)
  createProgram(@Body() data: any, @Request() req: any) {
    return this.subsidiesService.createProgram(data, req.user.wasamaId);
  }

  @Get('programs/gn')
  @Roles(Role.GN_OFFICER)
  getProgramsGn(@Request() req: any) {
    return this.subsidiesService.getProgramsByWasama(req.user.wasamaId);
  }

  @Get('programs/:programId/applications')
  @Roles(Role.GN_OFFICER)
  getApplications(@Param('programId') programId: string, @Request() req: any) {
    return this.subsidiesService.getApplicationsForProgram(programId, req.user.wasamaId);
  }

  @Patch('applications/:id/status')
  @Roles(Role.GN_OFFICER)
  updateStatus(@Param('id') id: string, @Body('status') status: string, @Request() req: any) {
    return this.subsidiesService.updateApplicationStatus(id, status, req.user.wasamaId);
  }

  // Resident Endpoints
  @Get('programs/resident')
  @Roles(Role.RESIDENT)
  getProgramsResident(@Request() req: any) {
    return this.subsidiesService.getAvailableProgramsForResident(req.user.residentId);
  }

  @Post('programs/:programId/apply')
  @Roles(Role.RESIDENT)
  apply(@Param('programId') programId: string, @Request() req: any) {
    return this.subsidiesService.applyForProgram(programId, req.user.residentId);
  }

  @Get('applications/resident')
  @Roles(Role.RESIDENT)
  getResidentApplications(@Request() req: any) {
    return this.subsidiesService.getResidentApplications(req.user.residentId);
  }
}
