import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsString()
  projectName: string;

  @IsNumber()
  @IsOptional()
  budget?: number;

  @IsNumber()
  @IsOptional()
  advance?: number;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsString()
  @IsOptional()
  projectProgress?: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsUUID()
  @IsOptional()
  categoryId?: string;
}
