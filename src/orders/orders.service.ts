import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus, PaymentStatus } from './entities/order.entity';
import { Repository, DeepPartial, ILike } from 'typeorm';

export interface OrderQueryOptions {
  query?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  clientId?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  private generateInvoiceNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `INV-${year}-${random}`;
  }

  private generateReceiptNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(100000 + Math.random() * 900000);
    return `REC-${year}-${random}`;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const subtotal =
      createOrderDto.subtotal !== undefined
        ? Number(createOrderDto.subtotal)
        : Number(createOrderDto.budget || 0);
    const discount = Number(createOrderDto.discount || 0);
    const tax = Number(createOrderDto.tax || 0);
    const budget =
      createOrderDto.budget !== undefined
        ? Number(createOrderDto.budget)
        : Math.max(0, subtotal - discount + tax);
    const isPaid =
      createOrderDto.paymentStatus &&
      String(createOrderDto.paymentStatus).toLowerCase() === PaymentStatus.PAID;

    let advance = Number(createOrderDto.advance || 0);
    if (isPaid && advance < budget) {
      advance = budget;
    }

    const initialPayments =
      Array.isArray(createOrderDto.payments) && createOrderDto.payments.length > 0
        ? createOrderDto.payments
        : advance > 0
        ? [
            {
              id: `pmt-${Date.now()}`,
              amount: advance,
              paymentDate: new Date().toISOString().split('T')[0],
              paymentMethod: isPaid ? 'Full Payment' : 'Initial Advance',
              receiptNumber: this.generateReceiptNumber(),
              note: isPaid
                ? 'Full payment received upon order creation'
                : 'Initial payment upon order onboarding',
              createdAt: new Date().toISOString(),
            },
          ]
        : [];

    const orderData: DeepPartial<Order> = {
      ...createOrderDto,
      subtotal,
      budget,
      advance,
      discount,
      tax,
      payments: initialPayments,
      invoiceNumber: createOrderDto.invoiceNumber || this.generateInvoiceNumber(),
      client: createOrderDto.clientId ? ({ id: createOrderDto.clientId } as any) : undefined,
      category: createOrderDto.categoryId ? ({ id: createOrderDto.categoryId } as any) : undefined,
    };

    if (createOrderDto.paymentStatus) {
      orderData.paymentStatus = createOrderDto.paymentStatus;
      if (isPaid) {
        orderData.advance = Math.max(budget, advance);
      }
    } else if (advance >= budget && budget > 0) {
      orderData.paymentStatus = PaymentStatus.PAID;
    } else if (advance > 0) {
      orderData.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      orderData.paymentStatus = PaymentStatus.UNPAID;
    }

    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async findAll(options?: OrderQueryOptions): Promise<Order[]> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.category', 'category')
      .orderBy('order.createdAt', 'DESC');

    if (options?.query) {
      const q = `%${options.query.trim().toLowerCase()}%`;
      queryBuilder.andWhere(
        '(LOWER(order.projectName) LIKE :q OR LOWER(order.invoiceNumber) LIKE :q OR LOWER(order.clientName) LIKE :q OR LOWER(client.name) LIKE :q OR LOWER(client.email) LIKE :q)',
        { q },
      );
    }

    if (options?.status) {
      queryBuilder.andWhere('order.status = :status', { status: options.status });
    }

    if (options?.paymentStatus) {
      queryBuilder.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: options.paymentStatus,
      });
    }

    if (options?.clientId) {
      queryBuilder.andWhere('client.id = :clientId', { clientId: options.clientId });
    }

    return await queryBuilder.getMany();
  }

  async findOneByClientId(clientId: string): Promise<Order[]> {
    return await this.findAll({ clientId });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        client: true,
        category: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByInvoiceNumber(invoiceNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { invoiceNumber },
      relations: {
        client: true,
        category: true,
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with invoice ${invoiceNumber} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    const updateData: any = { ...updateOrderDto };
    if (updateOrderDto.clientId !== undefined) {
      updateData.client = updateOrderDto.clientId ? { id: updateOrderDto.clientId } : null;
    }
    if (updateOrderDto.categoryId !== undefined) {
      updateData.category = updateOrderDto.categoryId ? { id: updateOrderDto.categoryId } : null;
    }

    if (updateOrderDto.subtotal !== undefined) {
      updateData.subtotal = Number(updateOrderDto.subtotal);
    }
    if (updateOrderDto.discount !== undefined) {
      updateData.discount = Number(updateOrderDto.discount);
    }
    if (updateOrderDto.tax !== undefined) {
      updateData.tax = Number(updateOrderDto.tax);
    }
    if (updateOrderDto.advance !== undefined) {
      updateData.advance = Number(updateOrderDto.advance);
    }

    const currentSubtotal =
      updateData.subtotal !== undefined ? Number(updateData.subtotal) : Number(order.subtotal || order.budget || 0);
    const currentDiscount =
      updateData.discount !== undefined ? Number(updateData.discount) : Number(order.discount || 0);
    const currentTax =
      updateData.tax !== undefined ? Number(updateData.tax) : Number(order.tax || 0);

    if (updateOrderDto.budget !== undefined) {
      updateData.budget = Number(updateOrderDto.budget);
    } else if (
      updateOrderDto.subtotal !== undefined ||
      updateOrderDto.discount !== undefined ||
      updateOrderDto.tax !== undefined
    ) {
      updateData.budget = Math.max(0, currentSubtotal - currentDiscount + currentTax);
    }

    const currentAdvance =
      updateData.advance !== undefined ? Number(updateData.advance) : Number(order.advance || 0);
    const currentBudget =
      updateData.budget !== undefined ? Number(updateData.budget) : Number(order.budget || 0);

    if (updateOrderDto.paymentStatus) {
      updateData.paymentStatus = updateOrderDto.paymentStatus;
      if (String(updateOrderDto.paymentStatus).toLowerCase() === PaymentStatus.PAID) {
        if (updateData.advance === undefined || Number(updateData.advance) < currentBudget) {
          updateData.advance = currentBudget;
        }
        const existingPayments = Array.isArray(order.payments) ? order.payments : [];
        const currentPaid = existingPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
        if (currentPaid < currentBudget) {
          const settlementAmount = currentBudget - currentPaid;
          const settlementPayment = {
            id: `pmt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            amount: settlementAmount,
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'Settlement Payment',
            receiptNumber: this.generateReceiptNumber(),
            note: 'Order marked as paid in full',
            createdAt: new Date().toISOString(),
          };
          updateData.payments = [...existingPayments, settlementPayment];
        }
      }
    } else if (currentAdvance >= currentBudget && currentBudget > 0) {
      updateData.paymentStatus = PaymentStatus.PAID;
    } else if (currentAdvance > 0) {
      updateData.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      updateData.paymentStatus = PaymentStatus.UNPAID;
    }

    Object.assign(order, updateData);
    return await this.orderRepository.save(order);
  }

  async addPayment(
    id: string,
    recordPaymentDto: {
      amount: number;
      paymentMethod?: string;
      paymentDate?: string;
      transactionId?: string;
      receiptNumber?: string;
      note?: string;
    },
  ): Promise<{ order: Order; payment: any }> {
    const order = await this.findOne(id);

    const receiptNumber = recordPaymentDto.receiptNumber || this.generateReceiptNumber();
    const newPayment = {
      id: `pmt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      amount: Number(recordPaymentDto.amount),
      paymentDate: recordPaymentDto.paymentDate || new Date().toISOString().split('T')[0],
      paymentMethod: recordPaymentDto.paymentMethod || 'Bank Transfer',
      transactionId: recordPaymentDto.transactionId || undefined,
      receiptNumber,
      note: recordPaymentDto.note || undefined,
      createdAt: new Date().toISOString(),
    };

    const existingPayments = Array.isArray(order.payments) ? order.payments : [];
    order.payments = [...existingPayments, newPayment];
    order.advance = Number(order.advance || 0) + Number(recordPaymentDto.amount);

    const total = Number(order.budget || 0);
    if (order.advance >= total && total > 0) {
      order.paymentStatus = PaymentStatus.PAID;
    } else if (order.advance > 0) {
      order.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      order.paymentStatus = PaymentStatus.UNPAID;
    }

    const savedOrder = await this.orderRepository.save(order);
    return { order: savedOrder, payment: newPayment };
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
