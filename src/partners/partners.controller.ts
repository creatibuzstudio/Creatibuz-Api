import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  async create(@Body() createPartnerDto: CreatePartnerDto) {
    const data = await this.partnersService.create(createPartnerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Partner created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.partnersService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Partners retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.partnersService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Partner retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePartnerDto: UpdatePartnerDto) {
    const data = await this.partnersService.update(id, updatePartnerDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Partner updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.partnersService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Partner deleted successfully',
      data: null,
    };
  }
}
