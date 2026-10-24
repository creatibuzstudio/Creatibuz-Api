import { PackageTitleService } from './package-title.service';
import { CreatePackageTitleDto } from './dto/create-package-title.dto';
import { UpdatePackageTitleDto } from './dto/update-package-title.dto';
export declare class PackageTitleController {
    private readonly packageTitleService;
    constructor(packageTitleService: PackageTitleService);
    create(createPackageTitleDto: CreatePackageTitleDto): Promise<import("./entities/package-title.entity").PackageTitle>;
    findAll(): Promise<import("./entities/package-title.entity").PackageTitle[]>;
    findOne(id: string): Promise<import("./entities/package-title.entity").PackageTitle>;
    update(id: string, updatePackageTitleDto: UpdatePackageTitleDto): Promise<import("./entities/package-title.entity").PackageTitle>;
    remove(id: string): Promise<void>;
}
