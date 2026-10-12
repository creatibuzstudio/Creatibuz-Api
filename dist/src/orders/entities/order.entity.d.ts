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
    budget: number;
    advance: number;
    paymentStatus: PaymentStatus;
    duration: string;
    status: OrderStatus;
    projectProgress: string;
    client: User;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
}
