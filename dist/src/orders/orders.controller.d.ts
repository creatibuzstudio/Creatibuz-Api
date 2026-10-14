import { HttpStatus } from '@nestjs/common';
import { OrdersService, OrderQueryOptions } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    recordPayment(id: string, recordPaymentDto: RecordPaymentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            order: import("./entities/order.entity").Order;
            payment: any;
        };
    }>;
    findAll(query?: OrderQueryOptions): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order[];
    }>;
    findByInvoiceNumber(invoiceNumber: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    findOneByClientId(clientId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order[];
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/order.entity").Order;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
