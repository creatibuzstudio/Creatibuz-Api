import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeLog } from './entities/time-log.entity';
import { User } from '../users/entities/user.entity';
import { TimeTrackerService } from './time-tracker.service';
import { TimeTrackerController } from './time-tracker.controller';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([TimeLog, User])],
  controllers: [TimeTrackerController],
  providers: [TimeTrackerService],
  exports: [TimeTrackerService],
})
export class TimeTrackerModule {}
