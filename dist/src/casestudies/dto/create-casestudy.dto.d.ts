export declare class CreateCasestudyDto {
    title: string;
    slug?: string;
    shortDescription?: string;
    fullDescription?: string;
    photoUrl?: string;
    images?: any;
    categoryId?: string;
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
    order?: number;
    isActive?: boolean;
}
