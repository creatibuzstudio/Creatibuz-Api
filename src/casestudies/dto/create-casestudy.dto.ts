import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateCasestudyDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @IsOptional()
  @IsString()
  fullDescription?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  photoUrl?: string;

  @IsOptional()
  images?: any;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  tag?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  bgColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  projectLink?: string;

  @IsOptional()
  @IsArray()
  stats?: Array<{ name: string; count: string; label?: string; value?: string }>;

  @IsOptional()
  @IsArray()
  metrics?: Array<{ label: string; value: string; name?: string; count?: string }>;

  @IsOptional()
  @IsString()
  challenge?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  challengePhoto?: string;

  @IsOptional()
  @IsString()
  challengePhotoDescription?: string;

  @IsOptional()
  @IsArray()
  challengePhotos?: Array<{ photoUrl: string; description?: string; title?: string }>;

  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  solutionPhoto?: string;

  @IsOptional()
  @IsString()
  solutionPhotoDescription?: string;

  @IsOptional()
  @IsArray()
  solutionPhotos?: Array<{ photoUrl: string; description?: string; title?: string }>;

  @IsOptional()
  @IsString()
  technologies?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

