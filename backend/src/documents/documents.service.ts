import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async createSharedDocument(data: { title: string; fileUrl: string; pradeshiyaSabhaIds: string[] }) {
    return this.prisma.sharedDocument.create({
      data: {
        title: data.title,
        fileUrl: data.fileUrl,
        pradeshiyaSabhas: {
          create: data.pradeshiyaSabhaIds.map(id => ({
            pradeshiyaSabha: { connect: { id } }
          }))
        }
      },
      include: {
        pradeshiyaSabhas: {
          include: {
            pradeshiyaSabha: true
          }
        }
      }
    });
  }

  async getAllSharedDocuments() {
    return this.prisma.sharedDocument.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        pradeshiyaSabhas: {
          include: {
            pradeshiyaSabha: true
          }
        }
      }
    });
  }

  async getMySharedDocuments(pradeshiyaSabhaId: string) {
    return this.prisma.sharedDocument.findMany({
      where: {
        pradeshiyaSabhas: {
          some: {
            pradeshiyaSabhaId
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
