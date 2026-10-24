import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePackageTitleDto } from './dto/create-package-title.dto';
import { UpdatePackageTitleDto } from './dto/update-package-title.dto';
import { PackageTitle } from './entities/package-title.entity';
export declare class PackageTitleService implements OnModuleInit {
    private readonly packageTitleRepository;
    private readonly logger;
    private isTableChecked;
    constructor(packageTitleRepository: Repository<PackageTitle>);
    onModuleInit(): Promise<void>;
    private ensureTableAndColumnsExist;
    create(createPackageTitleDto: CreatePackageTitleDto): Promise<PackageTitle>;
    findAll(): Promise<PackageTitle[]>;
    findOne(id: string): Promise<PackageTitle>;
    update(id: string, updatePackageTitleDto: UpdatePackageTitleDto): Promise<PackageTitle>;
    remove(id: string): Promise<void>;
}
