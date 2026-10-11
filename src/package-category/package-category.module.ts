import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageCategoryService } from './package-category.service';
import { PackageCategoryController } from './package-category.controller';
import { PackageCategory } from './entities/package-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageCategory])],
  controllers: [PackageCategoryController],
  providers: [PackageCategoryService],
})
export class PackageCategoryModule {}
