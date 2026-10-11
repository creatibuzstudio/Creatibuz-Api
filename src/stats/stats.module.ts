import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Casestudy, User, Partner])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
