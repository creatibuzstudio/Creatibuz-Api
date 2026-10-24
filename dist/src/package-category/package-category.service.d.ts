import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
import { PackageCategory } from './entities/package-category.entity';
export declare class PackageCategoryService implements OnModuleInit {
    private readonly packageCategoryRepository;
    private readonly logger;
    private isColumnChecked;
    constructor(packageCategoryRepository: Repository<PackageCategory>);
    onModuleInit(): Promise<void>;
    private ensureTitleColumn;
    create(createPackageCategoryDto: CreatePackageCategoryDto): Promise<PackageCategory>;
    findAll(): Promise<PackageCategory[]>;
    findOne(id: string): Promise<PackageCategory>;
    update(id: string, updatePackageCategoryDto: UpdatePackageCategoryDto): Promise<PackageCategory>;
    remove(id: string): Promise<PackageCategory>;
}
