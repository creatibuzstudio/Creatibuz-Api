import { User } from '../../users/entities/user.entity';
export declare class Department {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
