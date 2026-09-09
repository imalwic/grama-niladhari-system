import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WasamasService } from './wasamas.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('wasamas')
export class WasamasController {
  constructor(private readonly wasamasService: WasamasService) {}

  @Post()
  @Roles(Role.SUPER_ADMIN)
  createWasama(@Body() createWasamaDto: any, @Request() req: any) {
    return this.wasamasService.createWasama(
      createWasamaDto,
      req.user.pradeshiyaSabhaId,
    );
  }

  @Get()
  @Roles(Role.SUPER_ADMIN)
  findAll(@Request() req: any) {
    return this.wasamasService.findAllWasamas(req.user.pradeshiyaSabhaId);
  }

  @Post('officers')
  @Roles(Role.SUPER_ADMIN)
  createOfficer(@Body() createOfficerDto: any, @Request() req: any) {
    return this.wasamasService.createOfficer(
      createOfficerDto,
      req.user.pradeshiyaSabhaId,
    );
  }
}
