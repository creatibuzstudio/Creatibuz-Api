import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageBookingService } from './package-booking.service';
import { PackageBookingController } from './package-booking.controller';
import { PackageBooking } from './entities/package-booking.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageBooking, User])],
  controllers: [PackageBookingController],
  providers: [PackageBookingService],
})
export class PackageBookingModule {}
