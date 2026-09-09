import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  @Roles(Role.GN_OFFICER)
  create(@Body() createResidentDto: any, @Request() req: any) {
    return this.residentsService.create(createResidentDto, req.user.wasamaId);
  }

  @Get()
  @Roles(Role.GN_OFFICER)
  findAll(@Request() req: any) {
    return this.residentsService.findAllByWasama(req.user.wasamaId);
  }

  @Get(':id')
  @Roles(Role.GN_OFFICER)
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.residentsService.findOne(id, req.user.wasamaId);
  }

  @Patch(':id')
  @Roles(Role.GN_OFFICER)
  update(@Param('id') id: string, @Body() updateResidentDto: any, @Request() req: any) {
    return this.residentsService.update(id, updateResidentDto, req.user.wasamaId);
  }

  @Delete(':id')
  @Roles(Role.GN_OFFICER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.residentsService.remove(id, req.user.wasamaId);
  }
}
