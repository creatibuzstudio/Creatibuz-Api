import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';
export declare class PackageService implements OnModuleInit {
    private readonly packageRepository;
    private readonly logger;
    private isColumnChecked;
    constructor(packageRepository: Repository<Package>);
    onModuleInit(): Promise<void>;
    private ensureTitleColumn;
    create(createPackageDto: CreatePackageDto): Promise<Package>;
    findAll(): Promise<Package[]>;
    findOne(id: string): Promise<Package>;
    update(id: string, updatePackageDto: UpdatePackageDto): Promise<Package>;
    remove(id: string): Promise<void>;
}
