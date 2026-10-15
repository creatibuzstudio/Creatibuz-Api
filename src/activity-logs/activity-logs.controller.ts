import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';

@Controller(['activity-logs', 'logs'])
export class ActivityLogsController {
  constructor(private readonly logsService: ActivityLogsService) {}

  @Get()
  async findAll(@Query() query: QueryActivityLogDto) {
    const data = await this.logsService.findAll(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Activity logs retrieved successfully',
      data,
    };
  }

  @Get('stats')
  async getStats() {
    const data = await this.logsService.getStats();
    return {
      statusCode: HttpStatus.OK,
      message: 'Activity log metrics retrieved successfully',
      data,
    };
  }

  @Get('export')
  async getExport(@Query() query: QueryActivityLogDto) {
    const data = await this.logsService.getExportData(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'Activity logs export data retrieved successfully',
      data,
    };
  }

  @Post()
  async create(@Body() dto: CreateActivityLogDto, @Req() req: any) {
    const clientIp =
      req?.headers?.['x-forwarded-for'] ||
      req?.socket?.remoteAddress ||
      dto.ipAddress ||
      '127.0.0.1';
    const userAgent = req?.headers?.['user-agent'] || dto.userAgent;

    const data = await this.logsService.create({
      ...dto,
      ipAddress: String(clientIp).split(',')[0].trim(),
      userAgent: userAgent ? String(userAgent).slice(0, 300) : undefined,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Activity log created successfully',
      data,
    };
  }
}
