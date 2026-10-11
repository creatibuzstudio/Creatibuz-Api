import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDesignationDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
