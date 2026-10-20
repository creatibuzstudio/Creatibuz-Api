import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ActivityLog } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { User } from '../users/entities/user.entity';
export declare class ActivityLogsService implements OnModuleInit {
    private readonly logRepo;
    private readonly userRepo;
    private readonly logger;
    constructor(logRepo: Repository<ActivityLog>, userRepo: Repository<User>);
    onModuleInit(): Promise<void>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    fixExistingSystemAdministratorLogs(): Promise<void>;
    create(dto: CreateActivityLogDto): Promise<ActivityLog>;
    findAll(query: QueryActivityLogDto): Promise<{
        logs: ActivityLog[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getExportData(query: QueryActivityLogDto): Promise<ActivityLog[]>;
    getStats(): Promise<{
        totalLogs: number;
        todayLogs: number;
        uniqueUsers: number;
        byModule: Record<string, number>;
        byAction: Record<string, number>;
        topActors: any[];
        recentTrend: any[];
    }>;
    seedInitialLogsIfEmpty(): Promise<void>;
}
