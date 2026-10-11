import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const data = await this.ordersService.create(createOrderDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Order created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.ordersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Orders retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ordersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order retrieved successfully',
      data,
    };
  }

  @Get('client/:clientId')
  async findOneByClientId(@Param('clientId') clientId: string) {
    const data = await this.ordersService.findOneByClientId(clientId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Orders retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const data = await this.ordersService.update(id, updateOrderDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order removed successfully',
    };
  }
}
