import { User } from '../../users/entities/user.entity';
export declare class Review {
    id: string;
    client: User;
    thumbUrl: string;
    videoUrl: string;
    reviewText: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}
