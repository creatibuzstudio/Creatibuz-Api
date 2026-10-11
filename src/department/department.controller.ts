import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  async create(@Body() createDepartmentDto: CreateDepartmentDto) {
    const data = await this.departmentService.create(createDepartmentDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Department created successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.departmentService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Departments retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.departmentService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Department retrieved successfully',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDepartmentDto: UpdateDepartmentDto) {
    const data = await this.departmentService.update(id, updateDepartmentDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Department updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.departmentService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Department removed successfully',
    };
  }
}
