import { Test, TestingModule } from '@nestjs/testing';
import { PackageCategoryService } from './package-category.service';

describe('PackageCategoryService', () => {
  let service: PackageCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PackageCategoryService],
    }).compile();

    service = module.get<PackageCategoryService>(PackageCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
