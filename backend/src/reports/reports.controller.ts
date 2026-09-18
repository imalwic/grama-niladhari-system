import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request, ForbiddenException } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('request')
  @Roles(Role.PS_ADMIN)
  requestReport(@Body() data: { wasamaId: string }, @Request() req: any) {
    return this.reportsService.requestReport(data.wasamaId, req.user.id);
  }

  @Get('ps')
  @Roles(Role.PS_ADMIN)
  getPSReports(@Request() req: any) {
    return this.reportsService.getPSReports(req.user.id);
  }

  @Get('gn')
  @Roles(Role.GN_OFFICER)
  getGNReports(@Request() req: any) {
    return this.reportsService.getGNReports(req.user.wasamaId);
  }

  @Get(':id/preview')
  @Roles(Role.GN_OFFICER)
  previewReport(@Param('id') id: string, @Request() req: any) {
    return this.reportsService.previewReport(id, req.user.wasamaId, req.user.name);
  }

  @Patch(':id/approve')
  @Roles(Role.GN_OFFICER)
  approveReport(@Param('id') id: string, @Request() req: any) {
    return this.reportsService.approveReport(id, req.user.id, req.user.wasamaId, req.user.name);
  }

  @Patch(':id/reject')
  @Roles(Role.GN_OFFICER)
  rejectReport(@Param('id') id: string, @Request() req: any) {
    return this.reportsService.rejectReport(id, req.user.id, req.user.wasamaId);
  }
}
