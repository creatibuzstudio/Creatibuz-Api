import { Test, TestingModule } from '@nestjs/testing';
import { CasestudiesController } from './casestudies.controller';
import { CasestudiesService } from './casestudies.service';

describe('CasestudiesController', () => {
  let controller: CasestudiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CasestudiesController],
      providers: [CasestudiesService],
    }).compile();

    controller = module.get<CasestudiesController>(CasestudiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
