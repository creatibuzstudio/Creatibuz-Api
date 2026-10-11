import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { CasestudiesService } from './casestudies.service';
import { CreateCasestudyDto } from './dto/create-casestudy.dto';
import { UpdateCasestudyDto } from './dto/update-casestudy.dto';

@Controller('casestudies')
export class CasestudiesController {
  constructor(private readonly casestudiesService: CasestudiesService) {}

  @Post()
  async create(@Body() createCasestudyDto: CreateCasestudyDto) {
    const data = await this.casestudiesService.create(createCasestudyDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Casestudy created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.casestudiesService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Casestudies retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.casestudiesService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Casestudy retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCasestudyDto: UpdateCasestudyDto) {
    const data = await this.casestudiesService.update(id, updateCasestudyDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Casestudy updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.casestudiesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Casestudy removed successfully',
    };
  }
}
