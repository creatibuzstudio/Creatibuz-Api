import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DisbursePayrollDto {
  @IsNotEmpty()
  @IsString()
  monthYear: string; // e.g. '2026-10'

  @IsOptional()
  @IsString()
  paymentMethod?: string; // 'bank_transfer', 'cash', 'bkash', etc.

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @IsString()
  processedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
