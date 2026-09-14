import { Module } from '@nestjs/common';
import { SubsidiesService } from './subsidies.service';
import { SubsidiesController } from './subsidies.controller';

import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubsidiesService],
  controllers: [SubsidiesController]
})
export class SubsidiesModule {}
