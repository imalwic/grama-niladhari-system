import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Post()
  @Roles(Role.GN_OFFICER)
  create(@Body() createNoticeDto: any, @Request() req: any) {
    return this.noticesService.create(createNoticeDto, req.user.wasamaId, req.user.sub);
  }

  @Get('gn-officer')
  @Roles(Role.GN_OFFICER)
  findAllForGn(@Request() req: any) {
    return this.noticesService.findAllForGnOfficer(req.user.wasamaId);
  }

  @Get('resident')
  @Roles(Role.RESIDENT)
  findAllForResident(@Request() req: any) {
    return this.noticesService.findAllForResident(req.user.wasamaId);
  }

  @Delete(':id')
  @Roles(Role.GN_OFFICER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.noticesService.remove(id, req.user.wasamaId);
  }
}
