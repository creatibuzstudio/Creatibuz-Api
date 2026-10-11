import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const pkg = this.packageRepository.create(createPackageDto);
    return await this.packageRepository.save(pkg);
  }

  async findAll(): Promise<Package[]> {
    return await this.packageRepository.find({
      relations: { category: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Package> {
    const pkg = await this.packageRepository.findOne({ 
      where: { id },
      relations: { category: true } 
    });
    if (!pkg) {
      throw new NotFoundException(`Package with ID ${id} not found`);
    }
    return pkg;
  }

  async update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package> {
    const pkg = await this.findOne(id);
    Object.assign(pkg, updatePackageDto);
    return await this.packageRepository.save(pkg);
  }

  async remove(id: string): Promise<void> {
    const pkg = await this.findOne(id);
    await this.packageRepository.remove(pkg);
  }
}
