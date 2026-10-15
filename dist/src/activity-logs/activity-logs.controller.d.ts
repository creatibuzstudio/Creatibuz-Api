import { HttpStatus } from '@nestjs/common';
import { ActivityLogsService } from './activity-logs.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
export declare class ActivityLogsController {
    private readonly logsService;
    constructor(logsService: ActivityLogsService);
    findAll(query: QueryActivityLogDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            logs: import("./entities/activity-log.entity").ActivityLog[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            totalLogs: number;
            todayLogs: number;
            uniqueUsers: number;
            byModule: Record<string, number>;
            byAction: Record<string, number>;
            topActors: any[];
            recentTrend: any[];
        };
    }>;
    getExport(query: QueryActivityLogDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/activity-log.entity").ActivityLog[];
    }>;
    create(dto: CreateActivityLogDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/activity-log.entity").ActivityLog;
    }>;
}
