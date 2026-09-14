import { Controller, Post, Get, Body, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    })
  }))
  async createDocument(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const fileUrl = file ? `http://localhost:3001/uploads/${file.filename}` : body.fileUrl;
    
    // Parse pradeshiyaSabhaIds since they might come as a JSON string in FormData
    let psIds: string[] = [];
    if (body.pradeshiyaSabhaIds) {
      if (typeof body.pradeshiyaSabhaIds === 'string') {
        try {
          psIds = JSON.parse(body.pradeshiyaSabhaIds);
        } catch (e) {
          psIds = body.pradeshiyaSabhaIds.split(',');
        }
      } else if (Array.isArray(body.pradeshiyaSabhaIds)) {
        psIds = body.pradeshiyaSabhaIds;
      }
    }

    return this.documentsService.createSharedDocument({
      title: body.title,
      fileUrl: fileUrl,
      pradeshiyaSabhaIds: psIds
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async getAllDocuments() {
    return this.documentsService.getAllSharedDocuments();
  }

  @Get('ps')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.PS_ADMIN)
  async getMyDocuments(@Request() req: any) {
    return this.documentsService.getMySharedDocuments(req.user.pradeshiyaSabhaId);
  }
}
