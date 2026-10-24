import { Package } from '../../package/entities/package.entity';
export declare class PackageTitle {
    id: string;
    name: string;
    isActive: boolean;
    packages: Package[];
    createdAt: Date;
    updatedAt: Date;
}
