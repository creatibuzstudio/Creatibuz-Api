import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePartnerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
