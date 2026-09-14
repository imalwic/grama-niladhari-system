import { Module } from '@nestjs/common';
import { GrievancesService } from './grievances.service';
import { GrievancesController } from './grievances.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [GrievancesService, PrismaService],
  controllers: [GrievancesController]
})
export class GrievancesModule {}
