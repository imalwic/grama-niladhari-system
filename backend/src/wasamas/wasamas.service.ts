import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import PDFDocument from 'pdfkit';

@Injectable()
export class WasamasService {
  constructor(private prisma: PrismaService) {}

  async createWasama(createWasamaDto: any, pradeshiyaSabhaId: string) {
    return this.prisma.wasama.create({
      data: {
        name: createWasamaDto.name,
        code: createWasamaDto.code,
        pradeshiyaSabhaId: pradeshiyaSabhaId,
      },
    });
  }

  async findAllWasamas(pradeshiyaSabhaId: string) {
    return this.prisma.wasama.findMany({
      where: { pradeshiyaSabhaId },
      include: {
        officers: {
          select: { id: true, name: true, email: true, phone: true },
        },
        _count: {
          select: { households: true },
        },
      },
    });
  }

  async createOfficer(createOfficerDto: any, pradeshiyaSabhaId: string) {
    // Validate the wasama exists and belongs to this PS
    const wasama = await this.prisma.wasama.findFirst({
      where: { id: createOfficerDto.wasamaId, pradeshiyaSabhaId },
    });
    if (!wasama) {
      throw new NotFoundException('Wasama not found in your Pradeshiya Sabha');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createOfficerDto.password, salt);

    return this.prisma.user.create({
      data: {
        nic: createOfficerDto.nic,
        name: createOfficerDto.name,
        email: createOfficerDto.email,
        phone: createOfficerDto.phone,
        passwordHash,
        role: 'GN_OFFICER',
        wasamaId: createOfficerDto.wasamaId,
      },
    });
  }

  async getDashboardStats(wasamaId: string) {
    const currentYear = new Date().getFullYear();
    const startOf18YearsAgo = new Date(currentYear - 18, 0, 1);
    const endOf18YearsAgo = new Date(currentYear - 18, 11, 31, 23, 59, 59);

    const [totalHouseholds, totalResidents, newVoters, pendingRequests, issuedCertificates] = await Promise.all([
      this.prisma.household.count({ where: { wasamaId } }),
      this.prisma.resident.count({ where: { household: { wasamaId } } }),
      this.prisma.resident.count({
        where: {
          household: { wasamaId },
          dateOfBirth: {
            gte: startOf18YearsAgo,
            lte: endOf18YearsAgo
          }
        }
      }),
      this.prisma.request.count({
        where: {
          resident: { household: { wasamaId } },
          status: 'PENDING'
        }
      }),
      this.prisma.request.count({
        where: {
          resident: { household: { wasamaId } },
          status: 'APPROVED'
        }
      })
    ]);

    // Calculate Age Groups (0-18, 19-35, 36-60, 60+)
    const allResidents = await this.prisma.resident.findMany({
      where: { household: { wasamaId } },
      select: { dateOfBirth: true, relationshipToHead: true }
    });

    let ageDemographics = [
      { name: '0-18', value: 0 },
      { name: '19-35', value: 0 },
      { name: '36-60', value: 0 },
      { name: '60+', value: 0 },
    ];

    let relationshipDemographics: Record<string, number> = {};

    allResidents.forEach(res => {
      const age = currentYear - res.dateOfBirth.getFullYear();
      if (age <= 18) ageDemographics[0].value++;
      else if (age <= 35) ageDemographics[1].value++;
      else if (age <= 60) ageDemographics[2].value++;
      else ageDemographics[3].value++;

      const rel = res.relationshipToHead || 'Other';
      relationshipDemographics[rel] = (relationshipDemographics[rel] || 0) + 1;
    });

    const relationships = Object.keys(relationshipDemographics).map(key => ({
      name: key,
      value: relationshipDemographics[key]
    }));

    return {
      totalHouseholds,
      totalResidents,
      newVoters,
      pendingRequests,
      issuedCertificates,
      ageDemographics,
      relationships
    };
  }

  async generateDashboardReportPdf(wasamaId: string, wasamaName?: string): Promise<Buffer> {
    const stats = await this.getDashboardStats(wasamaId);
    
    let actualWasamaName = wasamaName;
    if (!actualWasamaName || actualWasamaName === 'Your Wasama') {
      const wasama = await this.prisma.wasama.findUnique({ where: { id: wasamaId }, select: { name: true } });
      actualWasamaName = wasama?.name || 'Unknown Wasama';
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        // Add a nice border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).strokeColor('#e2e8f0').lineWidth(2).stroke();

        // Header
        doc.fillColor('#003366')
           .fontSize(22)
           .font('Helvetica-Bold')
           .text('MONTHLY STATISTICS REPORT', { align: 'center' });
        
        doc.moveDown(0.2);
        doc.fillColor('#555555')
           .fontSize(12)
           .font('Helvetica')
           .text(`Grama Niladhari Division: ${actualWasamaName}`, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.moveDown(1);
        
        // Draw a dividing line
        doc.moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#cccccc').lineWidth(1).stroke();
        doc.moveDown(2);

        // Helper Function to draw a section header
        const drawSectionHeader = (title: string, yPos: number) => {
           // Check if we need to add a new page before drawing
           if (yPos > doc.page.height - 150) {
               doc.addPage();
               doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).strokeColor('#e2e8f0').lineWidth(2).stroke();
               yPos = 50;
           }
           doc.rect(50, yPos, 495, 25).fill('#003366');
           doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(11).text(title.toUpperCase(), 60, yPos + 7, { characterSpacing: 1 });
           doc.fillColor('#000000'); // reset
           return yPos + 35;
        };

        // Helper Function to draw a row
        const drawRow = (label: string, value: any, yPos: number, isAlternate: boolean) => {
           if (isAlternate) {
               doc.rect(50, yPos - 5, 495, 20).fill('#f8fafc');
           }
           doc.fillColor('#334155').font('Helvetica-Bold').fontSize(10).text(label, 60, yPos);
           doc.fillColor('#0f172a').font('Helvetica').text(String(value), 350, yPos);
           return yPos + 20;
        };

        let currentY = doc.y;

        // Summary Section
        currentY = drawSectionHeader('Overview Summary', currentY);
        currentY = drawRow('Total Households', stats.totalHouseholds, currentY, false);
        currentY = drawRow('Total Residents', stats.totalResidents, currentY, true);
        currentY = drawRow('New Eligible Voters (18+)', stats.newVoters, currentY, false);
        currentY = drawRow('Pending Certificate Requests', stats.pendingRequests, currentY, true);
        currentY = drawRow('Certificates Issued', stats.issuedCertificates, currentY, false);
        
        currentY += 20;

        // Age Demographics
        currentY = drawSectionHeader('Age Demographics', currentY);
        stats.ageDemographics.forEach((stat, index) => {
           currentY = drawRow(`Age ${stat.name}`, `${stat.value} residents`, currentY, index % 2 !== 0);
        });

        currentY += 20;

        // Household Roles
        currentY = drawSectionHeader('Household Roles', currentY);
        stats.relationships.forEach((stat, index) => {
           currentY = drawRow(stat.name, stat.value, currentY, index % 2 !== 0);
        });

        // Footer
        doc.fontSize(9).fillColor('#94a3b8').font('Helvetica-Oblique')
           .text('This is an auto-generated official system report.', 50, doc.page.height - 60, { align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
