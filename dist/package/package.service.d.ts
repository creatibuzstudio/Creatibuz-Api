import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
export declare class PackageService {
    private readonly packageRepository;
    constructor(packageRepository: Repository<Package>);
    create(createPackageDto: CreatePackageDto): Promise<Package>;
    findAll(): Promise<Package[]>;
    findOne(id: string): Promise<Package>;
    update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package>;
    remove(id: string): Promise<void>;
}
