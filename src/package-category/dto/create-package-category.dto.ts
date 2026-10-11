import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePackageCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
