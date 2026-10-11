import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CasestudiesService } from './casestudies.service';
import { CasestudiesController } from './casestudies.controller';
import { Casestudy } from './entities/casestudy.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Casestudy])],
  controllers: [CasestudiesController],
  providers: [CasestudiesService],
})
export class CasestudiesModule {}
