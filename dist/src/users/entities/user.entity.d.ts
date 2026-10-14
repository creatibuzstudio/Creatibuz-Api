import { Department } from '../../department/entities/department.entity';
import { Designation } from '../../designation/entities/designation.entity';
export declare enum UserRole {
    ADMIN = "admin",
    EMPLOYEE = "employee",
    CTO = "cto",
    CEO = "ceo",
    COO = "coo",
    CPM = "cpm",
    FOUNDER = "founder",
    HR = "hr",
    DEVELOPER = "developer",
    CLIENT = "client"
}
export declare class User {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    picture: string;
    location: string;
    role: UserRole;
    department: Department;
    designation: Designation;
    order: number;
    isPreview: boolean;
    createdAt: Date;
    updatedAt: Date;
}
