import { Test, TestingModule } from '@nestjs/testing';
import { CasestudiesService } from './casestudies.service';

describe('CasestudiesService', () => {
  let service: CasestudiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CasestudiesService],
    }).compile();

    service = module.get<CasestudiesService>(CasestudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
