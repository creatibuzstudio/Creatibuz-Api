import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CustomItemDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsNumber()
  bonus?: number;

  @IsOptional()
  @IsNumber()
  deductions?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class GeneratePayrollDto {
  @IsNotEmpty()
  @IsString()
  monthYear: string; // e.g. '2026-10'

  @IsOptional()
  @IsString()
  monthName?: string; // e.g. 'October 2026'

  @IsOptional()
  @IsString()
  distributionMethod?: 'equal' | 'proportional'; // default 'equal'

  @IsOptional()
  @IsString()
  processedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CustomItemDto)
  customItems?: CustomItemDto[];
}
