import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { WasamasService } from './wasamas.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('wasamas')
export class WasamasController {
  constructor(private readonly wasamasService: WasamasService) {}

  @Get('dashboard-stats')
  @Roles(Role.GN_OFFICER)
  getDashboardStats(@Request() req: any) {
    return this.wasamasService.getDashboardStats(req.user.wasamaId);
  }

  @Get('dashboard-report')
  @Roles(Role.GN_OFFICER)
  async getDashboardReportPdf(@Request() req: any, @Res() res: Response) {
    const pdfBuffer = await this.wasamasService.generateDashboardReportPdf(
      req.user.wasamaId,
      req.user.wasamaName || 'Your Wasama' // Note: may need to adjust based on payload
    );
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="wasama-report-${new Date().toISOString().split('T')[0]}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }

  @Post()
  @Roles(Role.PS_ADMIN)
  createWasama(@Body() createWasamaDto: any, @Request() req: any) {
    return this.wasamasService.createWasama(
      createWasamaDto,
      req.user.pradeshiyaSabhaId,
    );
  }

  @Get()
  @Roles(Role.PS_ADMIN)
  findAll(@Request() req: any) {
    return this.wasamasService.findAllWasamas(req.user.pradeshiyaSabhaId);
  }

  @Post('officers')
  @Roles(Role.PS_ADMIN)
  createOfficer(@Body() createOfficerDto: any, @Request() req: any) {
    return this.wasamasService.createOfficer(
      createOfficerDto,
      req.user.pradeshiyaSabhaId,
    );
  }
}
