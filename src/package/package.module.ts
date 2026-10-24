import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { Package } from './entities/package.entity';
import { PackageTitle } from '../package-title/entities/package-title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Package, PackageTitle])],
  controllers: [PackageController],
  providers: [PackageService],
})
export class PackageModule {}

