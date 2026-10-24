import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePackageTitleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
