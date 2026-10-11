import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';

@Controller('designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  async create(@Body() createDesignationDto: CreateDesignationDto) {
    const data = await this.designationService.create(createDesignationDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Designation created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.designationService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Designations retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.designationService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Designation retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDesignationDto: UpdateDesignationDto) {
    const data = await this.designationService.update(id, updateDesignationDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Designation updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.designationService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Designation removed successfully',
    };
  }
}
