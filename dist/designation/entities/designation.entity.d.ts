import { User } from '../../users/entities/user.entity';
export declare class Designation {
    id: string;
    title: string;
    description: string;
    level: string;
    isActive: boolean;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
