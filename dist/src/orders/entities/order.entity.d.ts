import { User } from '../../users/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
export declare enum OrderStatus {
    ONBOARD = "onboard",
    ONGOING = "ongoing",
    DELIVERY = "delivery",
    QA_TEST = "qa test",
    DELIVERED = "delivered"
}
export declare enum PaymentStatus {
    UNPAID = "unpaid",
    PARTIAL = "partial",
    PAID = "paid"
}
export declare class Order {
    id: string;
    projectName: string;
    subtotal: number;
    budget: number;
    advance: number;
    paymentStatus: PaymentStatus;
    duration: string;
    status: OrderStatus;
    invoiceNumber: string;
    projectProgress: string;
    dueDate: Date;
    discount: number;
    tax: number;
    payments?: Array<{
        id: string;
        amount: number;
        paymentDate: string;
        paymentMethod: string;
        transactionId?: string;
        receiptNumber?: string;
        note?: string;
        createdAt?: string;
    }>;
    notes: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientAddress: string;
    client: User;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
