import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsNumber()
  companyCostPercent?: number;

  @IsOptional()
  @IsNumber()
  employeePoolPercent?: number;

  @IsOptional()
  @IsNumber()
  leadershipPoolPercent?: number;

  @IsOptional()
  @IsString()
  ceoUserId?: string;

  @IsOptional()
  @IsString()
  cooUserId?: string;

  @IsOptional()
  @IsNumber()
  ceoShareRatio?: number;

  @IsOptional()
  @IsNumber()
  cooShareRatio?: number;

  @IsOptional()
  @IsNumber()
  ceoPercent?: number;

  @IsOptional()
  @IsNumber()
  cooPercent?: number;

  @IsOptional()
  @IsBoolean()
  autoDeductCostFromCompanyFund?: boolean;
}
