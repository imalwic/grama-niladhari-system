import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as QRCode from 'qrcode';

@Injectable()
export class PdfService {
  async generateCertificate(request: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Add a nice border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).stroke();

        // Header
        doc
          .fontSize(18)
          .font('Helvetica-Bold')
          .text('DEMOCRATIC SOCIALIST REPUBLIC OF SRI LANKA', { align: 'center' });
        
        doc.moveDown(0.5);
        
        doc
          .fontSize(14)
          .font('Helvetica-Bold')
          .text('Grama Niladhari Certificate', { align: 'center' });

        doc.moveDown(2);

        // Certificate Details
        doc.fontSize(12).font('Helvetica-Bold');
        doc.text('Certificate Information:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Type: ${request.requestType}`);
        doc.text(`Date of Issue: ${new Date().toLocaleDateString()}`);
        doc.text(`Reference No: ${request.id}`);

        doc.moveDown(1.5);

        // Resident Details
        doc.font('Helvetica-Bold').text('Resident Details:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Full Name: ${request.resident?.fullName || 'N/A'}`);
        doc.text(`NIC Number: ${request.resident?.nic || 'N/A'}`);
        if (request.resident?.household) {
           doc.text(`Address: ${request.resident.household.address}`);
           doc.text(`Household No: ${request.resident.household.houseNumber}`);
        }

        doc.moveDown(1.5);

        // GN Details
        doc.font('Helvetica-Bold').text('Division Details:', { underline: true });
        doc.moveDown(0.5);
        doc.font('Helvetica');
        doc.text(`Grama Niladhari Division: ${request.resident?.household?.wasama?.name || 'N/A'}`);

        doc.moveDown(4);

        // Official statement
        doc.font('Helvetica-Oblique').text(`This is to certify that the above mentioned details are true and correct to the best of my knowledge based on the household registry and records maintained at the Grama Niladhari Office.`, { align: 'justify' });

        doc.moveDown(4);

        // Signature Line
        doc.font('Helvetica');
        doc.text('......................................................', { align: 'right' });
        doc.text('Signature / Seal of Grama Niladhari', { align: 'right' });

        // Generate QR Code
        if (request.qrCodeToken) {
           const qrCodeDataUrl = await QRCode.toDataURL(`http://localhost:3000/en/verify/${request.qrCodeToken}`, { errorCorrectionLevel: 'H' });
           const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
           const imgBuffer = Buffer.from(base64Data, 'base64');
           
           // Put QR at bottom left
           doc.image(imgBuffer, 50, doc.page.height - 150, { width: 80 });
           doc.fontSize(8).text(`Verification Token:`, 140, doc.page.height - 130);
           doc.font('Helvetica-Bold').text(`${request.qrCodeToken}`, 140, doc.page.height - 120);
           doc.font('Helvetica').text('Scan to verify authenticity', 140, doc.page.height - 110);
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
