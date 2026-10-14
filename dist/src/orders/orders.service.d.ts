import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { Repository } from 'typeorm';
export interface OrderQueryOptions {
    query?: string;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    clientId?: string;
}
export declare class OrdersService {
    private readonly orderRepository;
    constructor(orderRepository: Repository<Order>);
    private generateInvoiceNumber;
    private generateReceiptNumber;
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(options?: OrderQueryOptions): Promise<Order[]>;
    findOneByClientId(clientId: string): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    findByInvoiceNumber(invoiceNumber: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    addPayment(id: string, recordPaymentDto: {
        amount: number;
        paymentMethod?: string;
        paymentDate?: string;
        transactionId?: string;
        receiptNumber?: string;
        note?: string;
    }): Promise<{
        order: Order;
        payment: any;
    }>;
    remove(id: string): Promise<void>;
}
