import { OrderStatus } from '../entities/order.entity';
export declare class CreateOrderDto {
    projectName: string;
    budget?: number;
    advance?: number;
    duration?: string;
    status?: OrderStatus;
    projectProgress?: string;
    clientId?: string;
    categoryId?: string;
}
