import { PackageCategory } from '../../package-category/entities/package-category.entity';
export declare class Package {
    id: string;
    name: string;
    description: string;
    price: number;
    features: string[];
    duration: string;
    isActive: boolean;
    category: PackageCategory;
    createdAt: Date;
    updatedAt: Date;
}
