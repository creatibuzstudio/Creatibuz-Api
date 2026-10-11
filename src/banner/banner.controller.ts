import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    const data = await this.bannerService.create(createBannerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Banner created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.bannerService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Banners retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.bannerService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateBannerDto: UpdateBannerDto) {
    const data = await this.bannerService.update(id, updateBannerDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bannerService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Banner removed successfully',
    };
  }
}
