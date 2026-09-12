import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PdfService } from './pdf.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { PrismaModule } from '../prisma/prisma.module';
import { VerifyController } from './verify.controller';

@Module({
  imports: [PrismaModule, NotificationsModule],
  controllers: [RequestsController, VerifyController],
  providers: [RequestsService, PdfService],
})
export class RequestsModule {}
