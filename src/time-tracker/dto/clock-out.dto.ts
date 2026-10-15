import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ClockOutDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  photo: string; // Base64 snapshot from webcam on clock-out

  @IsOptional()
  @IsString()
  sessionId?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  device?: string;
}
