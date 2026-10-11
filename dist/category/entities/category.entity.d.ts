import { Casestudy } from '../../casestudies/entities/casestudy.entity';
export declare class Category {
    id: string;
    name: string;
    icon?: string;
    order: number;
    isActive: boolean;
    casestudies: Casestudy[];
    createdAt: Date;
    updatedAt: Date;
}
