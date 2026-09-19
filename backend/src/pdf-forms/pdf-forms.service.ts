import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PdfFieldDetectorService } from './pdf-field-detector.service';
import { PDFDocument, rgb } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfFormsService {
  constructor(
    private prisma: PrismaService,
    private fieldDetector: PdfFieldDetectorService
  ) {}

  // -------------------------
  // CATEGORIES
  // -------------------------
  async createCategory(gnId: string, name: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: gnId },
      include: { wasama: true }
    });
    if (!user || !user.wasamaId) throw new BadRequestException('User is not assigned to a Wasama');

    return this.prisma.formCategory.create({
      data: {
        name,
        wasamaId: user.wasamaId
      }
    });
  }

  async getCategories(gnId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: gnId },
      include: { wasama: true }
    });
    if (!user || !user.wasamaId) throw new BadRequestException('User is not assigned to a Wasama');

    return this.prisma.formCategory.findMany({
      where: { wasamaId: user.wasamaId },
      include: { forms: true }
    });
  }

  // -------------------------
  // FORMS
  // -------------------------
  async createForm(gnId: string, title: string, categoryName: string, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('PDF file is required');
    
    const user = await this.prisma.user.findUnique({
      where: { id: gnId },
      include: { wasama: true }
    });
    if (!user || !user.wasamaId) throw new BadRequestException('User is not assigned to a Wasama');

    const uploadsDir = path.join(process.cwd(), 'uploads', 'pdf-forms');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    const filename = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, file.buffer);
    
    const pdfUrl = `http://localhost:3001/uploads/pdf-forms/${filename}`;

    // Find or create category based on the name provided
    let category = await this.prisma.formCategory.findFirst({
      where: {
        name: categoryName,
        wasamaId: user.wasamaId
      }
    });

    if (!category) {
      category = await this.prisma.formCategory.create({
        data: {
          name: categoryName,
          wasamaId: user.wasamaId
        }
      });
    }

    const createdForm = await this.prisma.dynamicForm.create({
      data: {
        title,
        categoryId: category.id,
        pdfUrl,
        uploadedById: gnId
      }
    });

    // AUTO-DETECT FIELDS
    try {
      const pdfDoc = await PDFDocument.load(file.buffer);
      const page = pdfDoc.getPage(0);
      const { width, height } = page.getSize();

      const detectedFields = await this.fieldDetector.detectFields(filePath, width, height);
      
      if (detectedFields.length > 0) {
        await this.prisma.formField.createMany({
          data: detectedFields.map(f => ({
            formId: createdForm.id,
            label: f.label || '',
            type: f.type,
            x: f.x,
            y: f.y,
            width: f.width,
            height: f.height,
            page: f.page
          }))
        });
      }
    } catch (error) {
      console.error("Auto-detect failed:", error);
    }

    return createdForm;
  }

  async getFormsByGN(gnId: string) {
    return this.prisma.dynamicForm.findMany({
      where: { uploadedById: gnId },
      include: { category: true, fields: true, _count: { select: { submissions: true } } }
    });
  }
  
  async getFormsForResident(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { residentId: true }
    });
    if (!user || !user.residentId) throw new BadRequestException('Resident profile not found');

    const resident = await this.prisma.resident.findUnique({
      where: { id: user.residentId },
      include: { household: true }
    });
    if (!resident || !resident.household) throw new BadRequestException('Resident not found or no household');
    
    const wasamaId = resident.household.wasamaId;
    
    const categories = await this.prisma.formCategory.findMany({
      where: { wasamaId },
      include: {
        forms: {
          where: { status: 'PUBLISHED' },
          include: { fields: true }
        }
      }
    });
    
    return categories;
  }
  
  async getFormById(id: string) {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { id },
      include: { fields: true, category: true }
    });
    if (!form) throw new NotFoundException('Form not found');
    return form;
  }

  async updateFormStatus(id: string, status: string) {
    return this.prisma.dynamicForm.update({
      where: { id },
      data: { status }
    });
  }

  // -------------------------
  // FIELDS
  // -------------------------
  async saveFields(formId: string, fields: any[]) {
    await this.prisma.formField.deleteMany({
      where: { formId }
    });
    
    const newFields = fields.map(f => ({
      formId,
      label: f.label,
      type: f.type || 'TEXT',
      x: f.x,
      y: f.y,
      width: f.width,
      height: f.height,
      page: f.page || 1
    }));
    
    await this.prisma.formField.createMany({
      data: newFields
    });
    
    return this.prisma.formField.findMany({ where: { formId } });
  }

  // -------------------------
  // SUBMISSIONS
  // -------------------------
  async submitForm(formId: string, userId: string, formData: Record<string, string>) {
    const form = await this.prisma.dynamicForm.findUnique({
      where: { id: formId },
      include: { fields: true }
    });
    
    if (!form) throw new NotFoundException('Form not found');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { residentId: true }
    });
    if (!user || !user.residentId) throw new BadRequestException('Resident profile not found');
    const residentId = user.residentId;
    
    const filename = form.pdfUrl.split('/').pop() || '';
    const pdfPath = path.join(process.cwd(), 'uploads', 'pdf-forms', filename);
    const pdfBytes = fs.readFileSync(pdfPath);
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    for (const field of form.fields) {
      const page = pdfDoc.getPage(field.page - 1);
      const { height } = page.getSize();
      
      const value = formData[field.id];
      if (value) {
        const drawY = height - field.y - field.height + 4;
        
        if (field.type === 'CHECKBOX' && (value === 'true' || value === 'on')) {
          page.drawText('X', {
            x: field.x + 2,
            y: drawY,
            size: 14,
            color: rgb(0, 0, 0),
          });
        } else if (field.type === 'TEXT') {
          page.drawText(value, {
            x: field.x + 2,
            y: drawY,
            size: 12,
            color: rgb(0, 0, 0),
          });
        }
      }
    }
    
    const filledPdfBytes = await pdfDoc.save();
    
    const submissionsDir = path.join(process.cwd(), 'uploads', 'pdf-submissions');
    if (!fs.existsSync(submissionsDir)) {
      fs.mkdirSync(submissionsDir, { recursive: true });
    }
    
    const submissionFilename = `submission-${Date.now()}-${residentId}.pdf`;
    const submissionPath = path.join(submissionsDir, submissionFilename);
    fs.writeFileSync(submissionPath, filledPdfBytes);
    
    const filledPdfUrl = `http://localhost:3001/uploads/pdf-submissions/${submissionFilename}`;
    
    return this.prisma.formSubmission.create({
      data: {
        formId,
        residentId,
        submissionData: JSON.stringify(formData),
        filledPdfUrl
      }
    });
  }

  async getSubmissionsByForm(formId: string) {
    return this.prisma.formSubmission.findMany({
      where: { formId },
      include: {
        resident: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
