import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ApproveExpenseDto {
  @IsNotEmpty()
  @IsIn(['ceo', 'coo', 'admin'])
  role: 'ceo' | 'coo' | 'admin';

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  userName?: string;

  @IsNotEmpty()
  @IsBoolean()
  approved: boolean;

  @IsOptional()
  @IsString()
  comment?: string;
}
