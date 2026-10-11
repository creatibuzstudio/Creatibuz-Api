import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePackageDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @IsNotEmpty()
  @IsString()
  duration: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  category?: any;
}
