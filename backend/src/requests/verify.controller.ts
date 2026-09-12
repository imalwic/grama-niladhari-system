import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { RequestsService } from './requests.service';

@Controller('verify')
export class VerifyController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get(':token')
  async verifyCertificate(@Param('token') token: string) {
    const request = await this.requestsService.findByToken(token);
    if (!request || request.status !== 'APPROVED') {
      throw new NotFoundException('Certificate not found or not valid');
    }
    
    return {
      isValid: true,
      requestType: request.requestType,
      dateOfIssue: request.updatedAt,
      residentName: request.resident.fullName,
      residentNic: request.resident.nic,
    };
  }
}
