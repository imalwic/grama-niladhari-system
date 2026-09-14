import { Test, TestingModule } from '@nestjs/testing';
import { GrievancesController } from './grievances.controller';

describe('GrievancesController', () => {
  let controller: GrievancesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrievancesController],
    }).compile();

    controller = module.get<GrievancesController>(GrievancesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
