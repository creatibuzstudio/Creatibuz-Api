import { HttpStatus } from '@nestjs/common';
import { TimeTrackerService } from './time-tracker.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { QueryTimeLogDto } from './dto/query-time-log.dto';
export declare class TimeTrackerController {
    private readonly timeTrackerService;
    constructor(timeTrackerService: TimeTrackerService);
    clockIn(dto: ClockInDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/time-log.entity").TimeLog;
    }>;
    clockOut(dto: ClockOutDto, req: any): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            session: import("./entities/time-log.entity").TimeLog;
            todayTotalSeconds: number;
        };
    }>;
    getActiveSession(userId: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            currentElapsedSeconds: number;
            id: string;
            userId: string;
            userName: string;
            userEmail: string;
            userRole: string;
            userPicture: string;
            department: string;
            designation: string;
            date: string;
            clockInTime: Date;
            clockOutTime: Date;
            clockInPhoto: string;
            clockOutPhoto: string;
            durationSeconds: number;
            note: string;
            status: string;
            ipAddress: string;
            device: string;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    getMyWorkReport(userId: string, query: QueryTimeLogDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            todayDate: string;
            todayTotalSeconds: number;
            dailyGoalSeconds: number;
            goalProgressPercent: number;
            isGoalAchieved: boolean;
            remainingSeconds: number;
            activeSession: any;
            totalSessions: number;
            sessions: import("./entities/time-log.entity").TimeLog[];
            historyByDate: {
                date: string;
                totalSeconds: number;
                sessions: import("./entities/time-log.entity").TimeLog[];
                goalAchieved: boolean;
            }[];
        };
    }>;
    getAdminLiveSessions(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            currentElapsedSeconds: number;
            id: string;
            userId: string;
            userName: string;
            userEmail: string;
            userRole: string;
            userPicture: string;
            department: string;
            designation: string;
            date: string;
            clockInTime: Date;
            clockOutTime: Date;
            clockInPhoto: string;
            clockOutPhoto: string;
            durationSeconds: number;
            note: string;
            status: string;
            ipAddress: string;
            device: string;
            createdAt: Date;
            updatedAt: Date;
        }[];
    }>;
    getAdminAllSessions(query: QueryTimeLogDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            sessions: import("./entities/time-log.entity").TimeLog[];
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getAdminDailyReport(date?: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            date: string;
            dailyGoalHours: number;
            dailyGoalSeconds: number;
            totalEmployees: number;
            totalCompanySeconds: number;
            totalCompanyHoursFormatted: string;
            totalAchievedCount: number;
            totalInProgressCount: number;
            totalShortHoursCount: number;
            totalAbsentCount: number;
            complianceRate: number;
            reports: {
                userId: string;
                userName: string;
                userEmail: string;
                userRole: import("../users/entities/user.entity").UserRole;
                userPicture: string;
                department: string;
                designation: string;
                date: string;
                totalDurationSeconds: number;
                formattedHours: string;
                progressPercent: number;
                isAchieved: boolean;
                isRunning: boolean;
                complianceStatus: string;
                sessionCount: number;
                firstClockIn: Date;
                lastClockOut: Date;
                clockInPhoto: string;
                clockOutPhoto: string;
                notes: string;
            }[];
        };
    }>;
    deleteSession(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
            id: string;
        };
    }>;
}
