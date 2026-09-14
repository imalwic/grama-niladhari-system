import { Controller, Post, Get, Body, Request, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async createDocument(@Body() body: { title: string; fileUrl: string; pradeshiyaSabhaIds: string[] }) {
    return this.documentsService.createSharedDocument(body);
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
