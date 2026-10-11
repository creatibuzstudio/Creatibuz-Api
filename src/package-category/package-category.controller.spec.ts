import { Test, TestingModule } from '@nestjs/testing';
import { PackageCategoryController } from './package-category.controller';
import { PackageCategoryService } from './package-category.service';

describe('PackageCategoryController', () => {
  let controller: PackageCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PackageCategoryController],
      providers: [PackageCategoryService],
    }).compile();

    controller = module.get<PackageCategoryController>(PackageCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
