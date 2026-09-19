import { Module } from '@nestjs/common';
import { PdfFormsService } from './pdf-forms.service';
import { PdfFormsController } from './pdf-forms.controller';
import { PdfFieldDetectorService } from './pdf-field-detector.service';

@Module({
  providers: [PdfFormsService, PdfFieldDetectorService],
  controllers: [PdfFormsController]
})
export class PdfFormsModule {}
