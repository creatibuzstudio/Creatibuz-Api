import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrdersService, OrderQueryOptions } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';

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

  @Post(':id/payment')
  async recordPayment(
    @Param('id') id: string,
    @Body() recordPaymentDto: RecordPaymentDto,
  ) {
    const data = await this.ordersService.addPayment(id, recordPaymentDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Payment recorded and receipt created successfully',
      data,
    };
  }

  @Get()
  async findAll(@Query() query?: OrderQueryOptions) {
    const data = await this.ordersService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Orders retrieved successfully',
      data,
    };
  }

  @Get('invoice/:invoiceNumber')
  async findByInvoiceNumber(@Param('invoiceNumber') invoiceNumber: string) {
    const data = await this.ordersService.findByInvoiceNumber(invoiceNumber);
    return {
      statusCode: HttpStatus.OK,
      message: 'Order invoice retrieved successfully',
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
