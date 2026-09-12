import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request, Res, NotFoundException, BadRequestException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PdfService } from './pdf.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import type { Response } from 'express';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(
    private readonly requestsService: RequestsService,
    private readonly pdfService: PdfService
  ) {}

  @Post()
  @Roles(Role.RESIDENT)
  create(@Body() createRequestDto: any, @Request() req: any) {
    return this.requestsService.create(createRequestDto, req.user.residentId);
  }

  @Get('resident')
  @Roles(Role.RESIDENT)
  findAllForResident(@Request() req: any) {
    return this.requestsService.findAllForResident(req.user.residentId);
  }

  @Get('gn-officer')
  @Roles(Role.GN_OFFICER)
  findAllForGnOfficer(@Request() req: any) {
    return this.requestsService.findAllForGnOfficer(req.user.wasamaId);
  }

  @Patch(':id/status')
  @Roles(Role.GN_OFFICER)
  updateStatus(@Param('id') id: string, @Body() updateData: any, @Request() req: any) {
    return this.requestsService.updateStatus(id, updateData.status, req.user.sub, updateData.notes);
  }

  @Get(':id/certificate')
  async getCertificate(@Param('id') id: string, @Res() res: Response) {
    const request = await this.requestsService.findByIdWithDetails(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    
    if (request.status !== 'APPROVED') {
      throw new BadRequestException('Certificate is not yet approved');
    }

    const pdfBuffer = await this.pdfService.generateCertificate(request);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="certificate-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }

  @Get(':id/application')
  @Roles(Role.GN_OFFICER, Role.RESIDENT)
  async getApplicationPdf(@Param('id') id: string, @Res() res: Response) {
    const request = await this.requestsService.findByIdWithDetails(id);
    if (!request) {
      throw new NotFoundException('Request not found');
    }
    
    const pdfBuffer = await this.pdfService.generateApplicationPdf(request);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="application-${id}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });
    
    res.end(pdfBuffer);
  }
}
