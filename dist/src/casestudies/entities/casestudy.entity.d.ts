import { Category } from '../../category/entities/category.entity';
export declare class Casestudy {
    id: string;
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    photoUrl: string;
    images?: any;
    categoryId: string;
    category: Category;
    tag?: string;
    bgColor?: string;
    projectLink?: string;
    stats?: Array<{
        name: string;
        count: string;
        label?: string;
        value?: string;
    }>;
    metrics?: Array<{
        label: string;
        value: string;
        name?: string;
        count?: string;
    }>;
    challenge?: string;
    challengePhoto?: string;
    challengePhotoDescription?: string;
    challengePhotos?: Array<{
        photoUrl: string;
        description?: string;
        title?: string;
    }>;
    solution?: string;
    solutionPhoto?: string;
    solutionPhotoDescription?: string;
    solutionPhotos?: Array<{
        photoUrl: string;
        description?: string;
        title?: string;
    }>;
    technologies?: string;
    order: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
