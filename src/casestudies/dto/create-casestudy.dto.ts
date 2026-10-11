import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCasestudyDto {
  @IsNotEmpty()
  @IsString()
  photoUrl: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
