import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async requestReport(wasamaId: string, userId: string) {
    return this.prisma.reportRequest.create({
      data: {
        wasamaId,
        requestedById: userId,
        status: 'PENDING',
        reportType: 'FULL_FAMILY_REPORT',
      },
      include: {
        wasama: true,
      }
    });
  }

  async getPSReports(userId: string) {
    return this.prisma.reportRequest.findMany({
      where: { requestedById: userId },
      include: {
        wasama: true,
        reviewedBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getGNReports(wasamaId: string) {
    return this.prisma.reportRequest.findMany({
      where: { wasamaId },
      include: {
        requestedBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async previewReport(id: string, wasamaId: string, gnName: string) {
    const reportReq = await this.prisma.reportRequest.findUnique({
      where: { id },
      include: { wasama: true }
    });

    if (!reportReq) throw new NotFoundException('Report request not found');
    if (reportReq.wasamaId !== wasamaId) throw new ForbiddenException('Not your Wasama');

    // Generate a temporary PDF for preview
    const pdfUrl = await this.generatePdfForWasama(wasamaId, reportReq.wasama.name, gnName);
    return { pdfUrl };
  }

  async approveReport(id: string, userId: string, wasamaId: string, gnName: string) {
    const reportReq = await this.prisma.reportRequest.findUnique({
      where: { id },
      include: { wasama: true }
    });

    if (!reportReq) throw new NotFoundException('Report request not found');
    if (reportReq.wasamaId !== wasamaId) throw new ForbiddenException('Not your Wasama');
    if (reportReq.status !== 'PENDING') throw new ForbiddenException('Already processed');

    // Generate PDF
    const pdfUrl = await this.generatePdfForWasama(wasamaId, reportReq.wasama.name, gnName);

    return this.prisma.reportRequest.update({
      where: { id },
      data: {
        status: 'APPROVED',
        pdfUrl,
        reviewedById: userId,
      }
    });
  }

  async rejectReport(id: string, userId: string, wasamaId: string) {
    const reportReq = await this.prisma.reportRequest.findUnique({ where: { id } });
    if (!reportReq) throw new NotFoundException('Report request not found');
    if (reportReq.wasamaId !== wasamaId) throw new ForbiddenException('Not your Wasama');

    return this.prisma.reportRequest.update({
      where: { id },
      data: {
        status: 'REJECTED',
        reviewedById: userId,
      }
    });
  }

  private async generatePdfForWasama(wasamaId: string, wasamaName: string, gnName: string): Promise<string> {
    const households = await this.prisma.household.findMany({
      where: { wasamaId },
      include: {
        residents: true,
        subsidyApplications: {
          include: { program: true }
        }
      },
      orderBy: { houseNumber: 'asc' }
    });

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const filename = `report_${wasamaId}_${Date.now()}.pdf`;
      const filepath = path.join(process.cwd(), 'uploads', filename);
      
      const stream = fs.createWriteStream(filepath);
      doc.pipe(stream);

      // Add Emblem
      const emblemPath = path.join(process.cwd(), 'emblem.png');
      if (fs.existsSync(emblemPath)) {
        doc.image(emblemPath, (doc.page.width - 50) / 2, 30, { width: 50 });
        doc.y = 130; // Move text safely below the image
      } else {
        doc.y = 50;
      }

      // Header
      doc.fontSize(16).font('Helvetica-Bold').text(`Comprehensive Household Report`, { align: 'center' });
      doc.moveDown(0.2);
      doc.fontSize(12).font('Helvetica').text(`Grama Niladhari Division: ${wasamaName}`, { align: 'center' });
      
      const actualGnName = gnName || 'Grama Niladhari';
      doc.fontSize(11).text(`Grama Niladhari Officer: ${actualGnName}`, { align: 'center' });
      doc.fontSize(9).fillColor('#666666').text(`Generated: ${new Date().toLocaleString()}`, { align: 'center' });
      doc.fillColor('#000000');
      doc.moveDown(1);

      // Draw a line
      doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').lineWidth(1).stroke();
      doc.moveDown(1);
      doc.strokeColor('#000000');

      for (const h of households) {
        doc.fontSize(12).font('Helvetica-Bold').text(`Household No: ${h.houseNumber}`);
        doc.fontSize(10).font('Helvetica').text(`Address: ${h.address}`);
        doc.moveDown(0.5);

        // Subsidies
        if (h.subsidyApplications.length > 0) {
          doc.fontSize(9).font('Helvetica-Oblique').text('Active Subsidies:');
          for (const s of h.subsidyApplications) {
            doc.text(`- ${s.program.name} (${s.status})`, { indent: 20 });
          }
          doc.moveDown(0.5);
        }

        // Residents Table
        const startY = doc.y;
        doc.fontSize(9).font('Helvetica-Bold');
        doc.text(`Name`, 50, startY);
        doc.text(`NIC/ID`, 220, startY);
        doc.text(`Rel. to Head`, 320, startY);
        doc.text(`Age`, 410, startY);
        doc.text(`Job`, 450, startY);
        doc.moveDown(0.2);

        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#eeeeee').lineWidth(1).stroke();
        doc.moveDown(0.2);

        doc.font('Helvetica');
        let currentY = doc.y;
        for (const r of h.residents) {
          // Check if page boundary exceeded
          if (currentY > 750) { 
            doc.addPage();
            currentY = 50; 
          }

          const age = new Date().getFullYear() - new Date(r.dateOfBirth).getFullYear();
          doc.text(r.fullName.substring(0, 28) || '-', 50, currentY);
          doc.text(r.nic || 'N/A', 220, currentY);
          doc.text(r.relationshipToHead || '-', 320, currentY);
          doc.text(`${age}`, 410, currentY);
          doc.text(r.occupation?.substring(0, 20) || 'None', 450, currentY);
          
          currentY += 15;
        }
        
        doc.y = currentY + 10;
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').stroke();
        doc.moveDown(1);
      }

      if (households.length === 0) {
        doc.text('No households found in this Wasama.');
      }

      doc.end();

      stream.on('finish', () => {
        resolve(`http://localhost:3001/uploads/${filename}`);
      });
      stream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
