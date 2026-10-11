import { Category } from '../../category/entities/category.entity';
export declare class Casestudy {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    photoUrl: string;
    categoryId: string;
    category: Category;
    projectLink?: string;
    challenge?: string;
    solution?: string;
    technologies?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
