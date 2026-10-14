import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;

  @IsString()
  @IsOptional()
  excerpt?: string;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  @MaxLength(150)
  author?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  seoTitle?: string;

  @IsString()
  @IsOptional()
  seoDescription?: string;

  @IsString()
  @IsOptional()
  seoKeywords?: string;

  @IsString()
  @IsOptional()
  keywords?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  metaTitle?: string;

  @IsString()
  @IsOptional()
  metaDescription?: string;

  @IsString()
  @IsOptional()
  metaKeywords?: string;
}
