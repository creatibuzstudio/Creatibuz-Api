import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PackageCategoryService } from './package-category.service';
import { CreatePackageCategoryDto } from './dto/create-package-category.dto';
import { UpdatePackageCategoryDto } from './dto/update-package-category.dto';

@Controller('package-category')
export class PackageCategoryController {
  constructor(private readonly packageCategoryService: PackageCategoryService) {}

  @Post()
  create(@Body() createPackageCategoryDto: CreatePackageCategoryDto) {
    return this.packageCategoryService.create(createPackageCategoryDto);
  }

  @Get()
  findAll() {
    return this.packageCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageCategoryDto: UpdatePackageCategoryDto) {
    return this.packageCategoryService.update(id, updatePackageCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packageCategoryService.remove(id);
  }
}
