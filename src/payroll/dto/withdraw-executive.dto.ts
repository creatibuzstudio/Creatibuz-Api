import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class WithdrawExecutiveDto {
  @IsNotEmpty()
  @IsString()
  monthYear: string; // e.g. '2026-10'

  @IsNotEmpty()
  @IsString()
  role: 'ceo' | 'coo';

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string; // 'bank_transfer', 'cheque', 'cash', 'bkash'

  @IsOptional()
  @IsString()
  transactionReference?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
