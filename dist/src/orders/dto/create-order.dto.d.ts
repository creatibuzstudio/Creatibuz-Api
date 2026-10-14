import { OrderStatus, PaymentStatus } from '../entities/order.entity';
export declare class CreateOrderDto {
    projectName: string;
    subtotal?: number;
    budget?: number;
    advance?: number;
    paymentStatus?: PaymentStatus;
    duration?: string;
    status?: OrderStatus;
    projectProgress?: string;
    invoiceNumber?: string;
    dueDate?: string;
    discount?: number;
    tax?: number;
    notes?: string;
    clientName?: string;
    clientEmail?: string;
    clientPhone?: string;
    clientAddress?: string;
    clientId?: string;
    categoryId?: string;
    payments?: any[];
}
