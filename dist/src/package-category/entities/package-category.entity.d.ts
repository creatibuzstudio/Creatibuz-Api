import { Package } from '../../package/entities/package.entity';
export declare class PackageCategory {
    id: string;
    name: string;
    description: string;
    packages: Package[];
    createdAt: Date;
    updatedAt: Date;
}
