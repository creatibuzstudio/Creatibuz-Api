import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @IsNotEmpty()
  clientId: string;

  @IsString()
  @IsOptional()
  thumbUrl?: string;

  @IsString()
  @IsOptional()
  videoUrl?: string;

  @IsString()
  @IsNotEmpty()
  reviewText: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;
}
