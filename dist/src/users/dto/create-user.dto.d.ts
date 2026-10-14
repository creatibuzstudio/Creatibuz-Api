import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    phone?: string;
    picture?: string;
    location?: string;
    role?: UserRole;
    departmentId?: string;
    designationId?: string;
    order?: number;
    isPreview?: boolean;
}
