import { PackageCategoryService } from './package-category.service';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';
export declare class PackageCategoryController {
    private readonly packageCategoryService;
    constructor(packageCategoryService: PackageCategoryService);
    create(createPackageCategoryDto: CreatePackageCategoryDto): Promise<import("./entities/package-category.entity").PackageCategory>;
    findAll(): Promise<import("./entities/package-category.entity").PackageCategory[]>;
    findOne(id: string): Promise<import("./entities/package-category.entity").PackageCategory>;
    update(id: string, updatePackageCategoryDto: UpdatePackageCategoryDto): Promise<import("./entities/package-category.entity").PackageCategory>;
    remove(id: string): Promise<import("./entities/package-category.entity").PackageCategory>;
}
