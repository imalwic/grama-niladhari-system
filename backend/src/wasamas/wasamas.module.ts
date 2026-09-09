import { Module } from '@nestjs/common';
import { WasamasController } from './wasamas.controller';
import { WasamasService } from './wasamas.service';

@Module({
  controllers: [WasamasController],
  providers: [WasamasService]
})
export class WasamasModule {}
