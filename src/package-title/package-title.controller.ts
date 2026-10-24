import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { PackageTitleService } from './package-title.service';
import { CreatePackageTitleDto } from './dto/create-package-title.dto';
import { UpdatePackageTitleDto } from './dto/update-package-title.dto';

@Controller(['package-title', 'package-tag'])
export class PackageTitleController {
  constructor(private readonly packageTitleService: PackageTitleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPackageTitleDto: CreatePackageTitleDto) {
    return this.packageTitleService.create(createPackageTitleDto);
  }

  @Get()
  findAll() {
    return this.packageTitleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packageTitleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageTitleDto: UpdatePackageTitleDto) {
    return this.packageTitleService.update(id, updatePackageTitleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.packageTitleService.remove(id);
  }
}
