import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PackageTitleService } from './package-title.service';
import { PackageTitleController } from './package-title.controller';
import { PackageTitle } from './entities/package-title.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PackageTitle])],
  controllers: [PackageTitleController],
  providers: [PackageTitleService],
  exports: [PackageTitleService, TypeOrmModule],
})
export class PackageTitleModule {}
