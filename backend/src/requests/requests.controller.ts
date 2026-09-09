import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

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
}
