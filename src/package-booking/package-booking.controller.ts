import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PackageBookingService } from './package-booking.service';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';

@Controller('package-booking')
export class PackageBookingController {
  constructor(private readonly packageBookingService: PackageBookingService) {}

  @Post()
  async create(@Body() createPackageBookingDto: CreatePackageBookingDto) {
    const data = await this.packageBookingService.create(createPackageBookingDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Package booking request submitted successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.packageBookingService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Package bookings retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.packageBookingService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package booking retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePackageBookingDto: UpdatePackageBookingDto) {
    const data = await this.packageBookingService.update(id, updatePackageBookingDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package booking updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.packageBookingService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Package booking deleted successfully',
      data: null,
    };
  }
}
