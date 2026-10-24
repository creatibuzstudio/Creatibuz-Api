import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
import { PackageCategory } from './entities/package-category.entity';

@Injectable()
export class PackageCategoryService implements OnModuleInit {
  private readonly logger = new Logger(PackageCategoryService.name);
  private isColumnChecked = false;

  constructor(
    @InjectRepository(PackageCategory)
    private readonly packageCategoryRepository: Repository<PackageCategory>,
  ) {}

  async onModuleInit() {
    await this.ensureTitleColumn();
  }

  private async ensureTitleColumn() {
    if (this.isColumnChecked) return;
    try {
      await this.packageCategoryRepository.query(`
        ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "title" VARCHAR(150);
      `);
      this.isColumnChecked = true;
      this.logger.log('Ensured "title" column exists in packages table.');
    } catch (err: any) {
      this.logger.warn(`Could not verify/add title column in packages: ${err?.message}`);
    }
  }

  async create(createPackageCategoryDto: CreatePackageCategoryDto) {
    const category = this.packageCategoryRepository.create(createPackageCategoryDto);
    return this.packageCategoryRepository.save(category);
  }

  async findAll() {
    await this.ensureTitleColumn();
    try {
      return await this.packageCategoryRepository.find({
        relations: { packages: true },
      });
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureTitleColumn();
        return await this.packageCategoryRepository.find({
          relations: { packages: true },
        });
      }
      throw err;
    }
  }

  async findOne(id: string) {
    await this.ensureTitleColumn();
    try {
      const category = await this.packageCategoryRepository.findOne({
        where: { id },
        relations: { packages: true },
      });
      if (!category) {
        throw new NotFoundException(`Package Category with ID ${id} not found`);
      }
      return category;
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureTitleColumn();
        const category = await this.packageCategoryRepository.findOne({
          where: { id },
          relations: { packages: true },
        });
        if (!category) {
          throw new NotFoundException(`Package Category with ID ${id} not found`);
        }
        return category;
      }
      throw err;
    }
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

