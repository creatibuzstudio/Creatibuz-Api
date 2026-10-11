import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePackageBookingDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;

  @IsNotEmpty()
  @IsEmail()
  companyEmail: string;

  @IsNotEmpty()
  @IsString()
  billingCycle: string;

  @IsNotEmpty()
  @IsString()
  packageId: string;
}
