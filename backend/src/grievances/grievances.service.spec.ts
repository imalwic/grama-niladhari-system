import { Test, TestingModule } from '@nestjs/testing';
import { GrievancesService } from './grievances.service';

describe('GrievancesService', () => {
  let service: GrievancesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GrievancesService],
    }).compile();

    service = module.get<GrievancesService>(GrievancesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
