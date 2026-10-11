import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, PaymentStatus } from './entities/order.entity';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const orderData: DeepPartial<Order> = {
      ...createOrderDto,
      client: createOrderDto.clientId ? { id: createOrderDto.clientId } as any : undefined,
      category: createOrderDto.categoryId ? { id: createOrderDto.categoryId } as any : undefined,
    };

    const advance = Number(createOrderDto.advance || 0);
    const budget = Number(createOrderDto.budget || 0);

    if (advance >= budget && budget > 0) {
      orderData.paymentStatus = PaymentStatus.PAID;
    } else if (advance > 0) {
      orderData.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      orderData.paymentStatus = PaymentStatus.UNPAID;
    }

    const order = this.orderRepository.create(orderData);
    return await this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: {
        client: true,
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOneByClientId(clientId: string): Promise<Order[]> {
    return await this.orderRepository.find({
      where: { client: { id: clientId } },
      relations: {
        client: true,
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
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

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);

    const updateData: any = { ...updateOrderDto };
    if (updateOrderDto.clientId) {
      updateData.client = { id: updateOrderDto.clientId };
    }
    if (updateOrderDto.categoryId) {
      updateData.category = { id: updateOrderDto.categoryId };
    }

    if (updateOrderDto.advance !== undefined) {
      updateData.advance = Number(order.advance) + Number(updateOrderDto.advance);
    }
    
    const currentAdvance = updateData.advance !== undefined ? updateData.advance : Number(order.advance);
    const currentBudget = updateData.budget !== undefined ? Number(updateData.budget) : Number(order.budget);
    
    if (currentAdvance >= currentBudget && currentBudget > 0) {
      updateData.paymentStatus = PaymentStatus.PAID;
    } else if (currentAdvance > 0) {
      updateData.paymentStatus = PaymentStatus.PARTIAL;
    } else {
      updateData.paymentStatus = PaymentStatus.UNPAID;
    }

    Object.assign(order, updateData);
    return await this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
