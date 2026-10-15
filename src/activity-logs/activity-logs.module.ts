import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ActivityLog } from './entities/activity-log.entity';
import { User } from '../users/entities/user.entity';
import { ActivityLogsService } from './activity-logs.service';
import { ActivityLogsController } from './activity-logs.controller';
import { ActivityLogInterceptor } from './interceptors/activity-log.interceptor';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([ActivityLog, User])],
  controllers: [ActivityLogsController],
  providers: [
    ActivityLogsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ActivityLogInterceptor,
    },
  ],
  exports: [ActivityLogsService],
})
export class ActivityLogsModule {}
