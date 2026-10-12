import { Repository } from 'typeorm';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
import { PackageCategory } from './entities/package-category.entity';
export declare class PackageCategoryService {
    private readonly packageCategoryRepository;
    constructor(packageCategoryRepository: Repository<PackageCategory>);
    create(createPackageCategoryDto: CreatePackageCategoryDto): Promise<PackageCategory>;
    findAll(): Promise<PackageCategory[]>;
    findOne(id: string): Promise<PackageCategory>;
    update(id: string, updatePackageCategoryDto: UpdatePackageCategoryDto): Promise<PackageCategory>;
    remove(id: string): Promise<PackageCategory>;
}
