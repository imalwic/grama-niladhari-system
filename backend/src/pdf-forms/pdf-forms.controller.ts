import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { PdfFormsService } from './pdf-forms.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pdf-forms')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class PdfFormsController {
  constructor(private readonly pdfFormsService: PdfFormsService) {}

  // -------------------------
  // CATEGORIES
  // -------------------------
  @Post('categories')
  @Roles('GN_OFFICER')
  createCategory(@Request() req: any, @Body('name') name: string) {
    if (!name) throw new BadRequestException('Category name is required');
    return this.pdfFormsService.createCategory(req.user.id, name);
  }

  @Get('categories')
  @Roles('GN_OFFICER')
  getCategories(@Request() req: any) {
    return this.pdfFormsService.getCategories(req.user.id);
  }

  // -------------------------
  // FORMS (GN_OFFICER)
  // -------------------------
  @Post()
  @Roles('GN_OFFICER')
  @UseInterceptors(FileInterceptor('file'))
  createForm(
    @Request() req: any,
    @Body('title') title: string,
    @Body('categoryName') categoryName: string,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!title) throw new BadRequestException('Title is required');
    return this.pdfFormsService.createForm(req.user.id, title, categoryName, file);
  }

  @Get()
  @Roles('GN_OFFICER')
  getFormsByGN(@Request() req: any) {
    return this.pdfFormsService.getFormsByGN(req.user.id);
  }

  @Get(':id')
  getFormById(@Param('id') id: string) {
    return this.pdfFormsService.getFormById(id);
  }

  @Patch(':id/status')
  @Roles('GN_OFFICER')
  updateFormStatus(@Param('id') id: string, @Body('status') status: string) {
    if (!status) throw new BadRequestException('Status is required');
    return this.pdfFormsService.updateFormStatus(id, status);
  }

  // -------------------------
  // FIELDS (GN_OFFICER)
  // -------------------------
  @Post(':id/fields')
  @Roles('GN_OFFICER')
  saveFields(@Param('id') id: string, @Body('fields') fields: any[]) {
    if (!Array.isArray(fields)) throw new BadRequestException('Fields must be an array');
    return this.pdfFormsService.saveFields(id, fields);
  }

  // -------------------------
  // RESIDENT ENDPOINTS
  // -------------------------
  @Get('resident/available')
  @Roles('RESIDENT')
  getFormsForResident(@Request() req: any) {
    return this.pdfFormsService.getFormsForResident(req.user.id);
  }

  @Post(':id/submit')
  @Roles('RESIDENT')
  submitForm(
    @Param('id') formId: string,
    @Request() req: any,
    @Body() formData: Record<string, string>
  ) {
    return this.pdfFormsService.submitForm(formId, req.user.id, formData);
  }

  // -------------------------
  // SUBMISSIONS (GN_OFFICER)
  // -------------------------
  @Get(':id/submissions')
  @Roles('GN_OFFICER')
  getSubmissionsByForm(@Param('id') id: string) {
    return this.pdfFormsService.getSubmissionsByForm(id);
  }
}
