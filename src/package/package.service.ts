import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService implements OnModuleInit {
  private readonly logger = new Logger(PackageService.name);
  private isColumnChecked = false;

  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) { }

  async onModuleInit() {
    await this.ensureTitleColumn();
  }

  private async ensureTitleColumn() {
    if (this.isColumnChecked) return;
    try {
      await this.packageRepository.query(`
        ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "title" VARCHAR(150);
      `);
      this.isColumnChecked = true;
      this.logger.log('Ensured "title" column exists in packages table.');
    } catch (err: any) {
      this.logger.warn(`Could not verify/add title column in packages: ${err?.message}`);
    }
  }

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    await this.ensureTitleColumn();
    const pkg = this.packageRepository.create(createPackageDto);
    if (createPackageDto.categoryId) {
      pkg.category = { id: createPackageDto.categoryId } as any;
    }
    return await this.packageRepository.save(pkg);
  }

  async findAll(): Promise<Package[]> {
    await this.ensureTitleColumn();
    try {
      return await this.packageRepository.find({
        relations: { category: true },
        order: { createdAt: 'DESC' },
      });
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureTitleColumn();
        return await this.packageRepository.find({
          relations: { category: true },
          order: { createdAt: 'DESC' },
        });
      }
      throw err;
    }
  }

  async findOne(id: string): Promise<Package> {
    await this.ensureTitleColumn();
    try {
      const pkg = await this.packageRepository.findOne({
        where: { id },
        relations: { category: true }
      });
      if (!pkg) {
        throw new NotFoundException(`Package with ID ${id} not found`);
      }
      return pkg;
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureTitleColumn();
        const pkg = await this.packageRepository.findOne({
          where: { id },
          relations: { category: true }
        });
        if (!pkg) {
          throw new NotFoundException(`Package with ID ${id} not found`);
        }
        return pkg;
      }
      throw err;
    }
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    await this.ensureTitleColumn();
    const pkg = await this.findOne(id);
    Object.assign(pkg, updatePackageDto);
    if (updatePackageDto.categoryId) {
      pkg.category = { id: updatePackageDto.categoryId } as any;
    }
    return await this.packageRepository.save(pkg);
  }

  async remove(id: string): Promise<void> {
    const pkg = await this.findOne(id);
    await this.packageRepository.remove(pkg);
  }
}

