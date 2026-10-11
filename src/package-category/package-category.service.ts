import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
import { PackageCategory } from './entities/package-category.entity';

@Injectable()
export class PackageCategoryService {
  constructor(
    @InjectRepository(PackageCategory)
    private readonly packageCategoryRepository: Repository<PackageCategory>,
  ) {}

  create(createPackageCategoryDto: CreatePackageCategoryDto) {
    const category = this.packageCategoryRepository.create(createPackageCategoryDto);
    return this.packageCategoryRepository.save(category);
  }

  findAll() {
    return this.packageCategoryRepository.find({ relations: { packages: true } });
  }

  async findOne(id: string) {
    const category = await this.packageCategoryRepository.findOne({
      where: { id },
      relations: { packages: true },
    });
    if (!category) {
      throw new NotFoundException(`Package Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updatePackageCategoryDto: UpdatePackageCategoryDto) {
    const category = await this.findOne(id);
    Object.assign(category, updatePackageCategoryDto);
    return this.packageCategoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    return this.packageCategoryRepository.remove(category);
  }
}
