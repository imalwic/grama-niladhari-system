import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { HouseholdsService } from './households.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('households')
export class HouseholdsController {
  constructor(private readonly householdsService: HouseholdsService) {}

  @Post()
  @Roles(Role.GN_OFFICER)
  create(@Body() createHouseholdDto: any, @Request() req: any) {
    return this.householdsService.create(createHouseholdDto, req.user.wasamaId);
  }

  @Post('bulk-import')
  @Roles(Role.GN_OFFICER)
  @UseInterceptors(FileInterceptor('file'))
  async bulkImport(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    return this.householdsService.bulkImport(file.buffer, req.user.wasamaId);
  }

  @Get()
  @Roles(Role.GN_OFFICER)
  findAll(@Request() req: any) {
    return this.householdsService.findAllByWasama(req.user.wasamaId);
  }

  @Get(':id')
  @Roles(Role.GN_OFFICER)
  findOne(@Param('id') id: string, @Request() req: any) {
    return this.householdsService.findOne(id, req.user.wasamaId);
  }

  @Patch(':id')
  @Roles(Role.GN_OFFICER)
  update(@Param('id') id: string, @Body() updateHouseholdDto: any, @Request() req: any) {
    return this.householdsService.update(id, updateHouseholdDto, req.user.wasamaId);
  }

  @Delete(':id')
  @Roles(Role.GN_OFFICER)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.householdsService.remove(id, req.user.wasamaId);
  }
}
