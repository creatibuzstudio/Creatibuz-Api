import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TimeTrackerService } from './time-tracker.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryTimeLogDto } from './dto/query-time-log.dto';

@Controller('time-tracker')
export class TimeTrackerController {
  constructor(private readonly timeTrackerService: TimeTrackerService) {}

  // 1. Clock In with camera photo
  @Post('clock-in')
  async clockIn(@Body() dto: ClockInDto, @Req() req: any) {
    const clientIp =
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      dto.ipAddress ||
      '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || dto.device;

    const data = await this.timeTrackerService.clockIn({
      ...dto,
      ipAddress: String(clientIp).split(',')[0].trim(),
      device: userAgent ? String(userAgent).slice(0, 300) : undefined,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Clock-in session started with webcam photo verification',
      data,
    };
  }

  // 2. Clock Out with camera photo
  @Post('clock-out')
  async clockOut(@Body() dto: ClockOutDto, @Req() req: any) {
    const clientIp =
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      dto.ipAddress ||
      '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || dto.device;

    const data = await this.timeTrackerService.clockOut({
      ...dto,
      ipAddress: String(clientIp).split(',')[0].trim(),
      device: userAgent ? String(userAgent).slice(0, 300) : undefined,
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'Work session completed and logged successfully',
      data,
    };
  }

  // 3. Get active running session for user
  @Get('active')
  async getActiveSession(@Query('userId') userId: string) {
    const data = await this.timeTrackerService.getActiveSession(userId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Active session retrieved',
      data,
    };
  }

  // 4. Employee's own work attendance and 6-hour goal report
  @Get('my-report')
  async getMyWorkReport(
    @Query('userId') userId: string,
    @Query() query: QueryTimeLogDto,
  ) {
    const data = await this.timeTrackerService.getMyWorkReport(userId, query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Employee work report and goal progress retrieved',
      data,
    };
  }

  // 5. Admin: Live currently clocked-in members
  @Get('admin/live')
  async getAdminLiveSessions() {
    const data = await this.timeTrackerService.getAdminLiveSessions();
    return {
      statusCode: HttpStatus.OK,
      message: 'Live active employee sessions retrieved',
      data,
    };
  }

  // 6. Admin: All time log sessions with pagination & search
  @Get('admin/sessions')
  async getAdminAllSessions(@Query() query: QueryTimeLogDto) {
    const data = await this.timeTrackerService.getAdminAllSessions(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'All employee sessions retrieved',
      data,
    };
  }

  // 7. Admin: Daily attendance compliance report (Target: 6 hours/day)
  @Get('admin/daily-report')
  async getAdminDailyReport(@Query('date') date?: string) {
    const data = await this.timeTrackerService.getAdminDailyReport(date);
    return {
      statusCode: HttpStatus.OK,
      message: 'Daily attendance and 6-hour compliance report retrieved',
      data,
    };
  }
}
