import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

// Using require since pdf2json might not have great TS typings
const PDFParser = require('pdf2json');

export interface DetectedField {
  type: 'TEXT' | 'CHECKBOX';
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
}

@Injectable()
export class PdfFieldDetectorService {
  /**
   * Scans a PDF file for visual boxes and lines, returning auto-detected form fields.
   */
  async detectFields(filePath: string, actualPdfWidth: number, actualPdfHeight: number): Promise<DetectedField[]> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();

      pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
      pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
        try {
          const fields: DetectedField[] = [];

          // pdf2json coordinates are based on a width of 63 units
          // We need to scale these to the react-pdf space
          pdfData.Pages.forEach((pageData: any, pageIndex: number) => {
            const pageNum = pageIndex + 1;
            const pdfJsonW = pageData.Width;
            const pdfJsonH = pageData.Height; // pdf2json height is sometimes proportional

            // To map coordinates to actual PDF points:
            // The Fills, HLines, VLines are in pdf2json units.
            // Width in pdfJson is usually relative to a 96DPI or so scale.
            // But we will use ratios.
            const scaleX = actualPdfWidth / pdfJsonW;
            const scaleY = actualPdfHeight / pdfJsonH; // Warning: pdf2json coordinates might be scaled uniformly.

            // Wait, pdf2json unit is standard: 1 unit = 22.5 points (approx).
            // Let's rely strictly on the ratio:
            const toX = (val: number) => val * scaleX;
            const toY = (val: number) => val * scaleY;
            const toW = (val: number) => val * scaleX;
            const toH = (val: number) => val * scaleY;

            const hlines: any[] = pageData.HLines || [];
            const vlines: any[] = pageData.VLines || [];
            const fills: any[] = pageData.Fills || [];

            // DETECT TEXT LINES (Horizontal lines that are long enough)
            hlines.forEach((hline: any) => {
              if (hline.l > 2) {
                const width = toW(hline.l);
                const height = 20;
                const x = toX(hline.x);
                const y = toY(hline.y) - height + 4;

                fields.push({ type: 'TEXT', label: '', x, y, width, height, page: pageNum });
              }
            });

            // Detect Text Lines from thin Fills
            fills.forEach((fill: any) => {
              if (fill.w > 2 && fill.h < 0.2) {
                const width = toW(fill.w);
                const height = 20;
                const x = toX(fill.x);
                const y = toY(fill.y) - height + 4;

                fields.push({ type: 'TEXT', label: '', x, y, width, height, page: pageNum });
              }
            });

            // DETECT CHECKBOXES
            // A checkbox might be 2 HLines and 2 VLines very close to each other forming a small box.
            // Let's find pairs of HLines that have similar x and width, and small y difference.
            for (let i = 0; i < hlines.length; i++) {
              for (let j = i + 1; j < hlines.length; j++) {
                const hl1 = hlines[i];
                const hl2 = hlines[j];
                
                // Are they vertically aligned and same length?
                if (Math.abs(hl1.x - hl2.x) < 0.5 && Math.abs(hl1.l - hl2.l) < 0.5) {
                  const yDiff = Math.abs(hl1.y - hl2.y);
                  
                  // If distance is small (like a small box)
                  if (yDiff > 0.5 && yDiff < 3) {
                    const x = toX(Math.min(hl1.x, hl2.x));
                    const y = toY(Math.min(hl1.y, hl2.y));
                    const width = toW(hl1.l);
                    const height = toH(yDiff);
                    
                    fields.push({ type: 'CHECKBOX', label: '', x, y, width, height, page: pageNum });
                  }
                }
              }
            }

            // Detect checkboxes from Fills (e.g. unfilled borders or solid small boxes)
            fills.forEach((fill: any) => {
              // A square-like fill that is small
              if (fill.w > 0.5 && fill.w < 3 && fill.h > 0.5 && fill.h < 3) {
                const ratio = fill.w / fill.h;
                if (ratio > 0.5 && ratio < 2) {
                  fields.push({
                    type: 'CHECKBOX',
                    label: '',
                    x: toX(fill.x),
                    y: toY(fill.y),
                    width: toW(fill.w),
                    height: toH(fill.h),
                    page: pageNum
                  });
                }
              }
            });

          });

          // Post-processing: Remove overlapping Text fields that were actually checkbox lines
          const filteredFields = fields.filter(f1 => {
            if (f1.type === 'TEXT') {
              // Does this text field intersect with a checkbox?
              const overlap = fields.some(f2 => {
                if (f2.type === 'CHECKBOX') {
                  return (
                    f1.x < f2.x + f2.width &&
                    f1.x + f1.width > f2.x &&
                    f1.y < f2.y + f2.height &&
                    f1.y + f1.height > f2.y
                  );
                }
                return false;
              });
              return !overlap;
            }
            return true;
          });

          resolve(filteredFields);
        } catch (err) {
          reject(err);
        }
      });

      pdfParser.loadPDF(filePath);
    });
  }
}
