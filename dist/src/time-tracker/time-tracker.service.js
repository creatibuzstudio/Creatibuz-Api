"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TimeTrackerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const time_log_entity_1 = require("./entities/time-log.entity");
const user_entity_1 = require("../users/entities/user.entity");
let TimeTrackerService = TimeTrackerService_1 = class TimeTrackerService {
    constructor(timeLogRepo, userRepo) {
        this.timeLogRepo = timeLogRepo;
        this.userRepo = userRepo;
        this.logger = new common_1.Logger(TimeTrackerService_1.name);
        this.DAILY_GOAL_SECONDS = 6 * 3600;
    }
    async onModuleInit() {
        try {
            await this.seedInitialTimeLogsIfEmpty();
        }
        catch (err) {
            this.logger.warn(`TimeTracker initial check: ${err.message}`);
        }
    }
    async clockIn(dto) {
        if (!dto.userId) {
            throw new common_1.BadRequestException('User ID is required for clocking in');
        }
        if (!dto.photo) {
            throw new common_1.BadRequestException('Webcam verification photo is required to start time tracking');
        }
        const existingRunning = await this.timeLogRepo.findOne({
            where: {
                userId: dto.userId,
                status: time_log_entity_1.TimeLogStatus.RUNNING,
            },
            order: { clockInTime: 'DESC' },
        });
        if (existingRunning) {
            return existingRunning;
        }
        let user = null;
        try {
            user = await this.userRepo.findOne({
                where: { id: dto.userId },
                relations: { department: true, designation: true },
            });
        }
        catch { }
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];
        const session = this.timeLogRepo.create({
            userId: dto.userId,
            userName: dto.userName || user?.name || 'Team Member',
            userEmail: dto.userEmail || user?.email || null,
            userRole: dto.userRole || user?.role || 'employee',
            userPicture: dto.userPicture || user?.picture || null,
            department: dto.department || user?.department?.name || 'Operations',
            designation: dto.designation || user?.designation?.title || 'Staff',
            date: todayDate,
            clockInTime: now,
            clockInPhoto: dto.photo,
            durationSeconds: 0,
            note: dto.note || 'Work shift started with webcam verification',
            status: time_log_entity_1.TimeLogStatus.RUNNING,
            ipAddress: dto.ipAddress || '127.0.0.1',
            device: dto.device || 'Desktop / Webcam',
        });
        return await this.timeLogRepo.save(session);
    }
    async clockOut(dto) {
        if (!dto.userId) {
            throw new common_1.BadRequestException('User ID is required for clocking out');
        }
        if (!dto.photo) {
            throw new common_1.BadRequestException('Webcam verification photo is required to stop time tracking');
        }
        const session = await this.timeLogRepo.findOne({
            where: dto.sessionId
                ? { id: dto.sessionId }
                : { userId: dto.userId, status: time_log_entity_1.TimeLogStatus.RUNNING },
            order: { clockInTime: 'DESC' },
        });
        if (!session || session.status !== time_log_entity_1.TimeLogStatus.RUNNING) {
            throw new common_1.BadRequestException('No active running time session found to clock out');
        }
        const now = new Date();
        const elapsedSeconds = Math.max(1, Math.round((now.getTime() - new Date(session.clockInTime).getTime()) / 1000));
        session.clockOutTime = now;
        session.clockOutPhoto = dto.photo;
        session.durationSeconds = elapsedSeconds;
        session.status = time_log_entity_1.TimeLogStatus.COMPLETED;
        if (dto.note) {
            session.note = session.note ? `${session.note} • ${dto.note}` : dto.note;
        }
        if (dto.ipAddress)
            session.ipAddress = dto.ipAddress;
        if (dto.device)
            session.device = dto.device;
        const savedSession = await this.timeLogRepo.save(session);
        const todayDate = session.date || now.toISOString().split('T')[0];
        const todayTotalSeconds = await this.getUserDurationForDate(dto.userId, todayDate);
        return {
            session: savedSession,
            todayTotalSeconds,
        };
    }
    async getActiveSession(userId) {
        if (!userId)
            return null;
        const session = await this.timeLogRepo.findOne({
            where: {
                userId,
                status: time_log_entity_1.TimeLogStatus.RUNNING,
            },
            order: { clockInTime: 'DESC' },
        });
        if (!session)
            return null;
        const now = Date.now();
        const currentElapsedSeconds = Math.max(0, Math.round((now - new Date(session.clockInTime).getTime()) / 1000));
        return {
            ...session,
            currentElapsedSeconds,
        };
    }
    async getMyWorkReport(userId, query) {
        if (!userId) {
            throw new common_1.BadRequestException('User ID is required');
        }
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];
        const qb = this.timeLogRepo.createQueryBuilder('log');
        qb.where('log.userId = :userId', { userId });
        if (query.date) {
            qb.andWhere('log.date = :date', { date: query.date });
        }
        else if (query.startDate && query.endDate) {
            qb.andWhere('log.date >= :startDate AND log.date <= :endDate', {
                startDate: query.startDate,
                endDate: query.endDate,
            });
        }
        qb.orderBy('log.clockInTime', 'DESC');
        const sessions = await qb.getMany();
        const todaySessions = sessions.filter((s) => s.date === todayDate);
        let todaySeconds = 0;
        let activeSession = null;
        for (const s of todaySessions) {
            if (s.status === time_log_entity_1.TimeLogStatus.RUNNING) {
                const elapsed = Math.max(0, Math.round((now.getTime() - new Date(s.clockInTime).getTime()) / 1000));
                todaySeconds += elapsed;
                activeSession = { ...s, currentElapsedSeconds: elapsed };
            }
            else {
                todaySeconds += Number(s.durationSeconds || 0);
            }
        }
        const dailyGoalSeconds = this.DAILY_GOAL_SECONDS;
        const goalProgressPercent = Math.min(100, Math.round((todaySeconds / dailyGoalSeconds) * 100));
        const isGoalAchieved = todaySeconds >= dailyGoalSeconds;
        const remainingSeconds = Math.max(0, dailyGoalSeconds - todaySeconds);
        const historyByDate = {};
        for (const s of sessions) {
            const d = s.date;
            if (!historyByDate[d]) {
                historyByDate[d] = {
                    date: d,
                    totalSeconds: 0,
                    sessions: [],
                    goalAchieved: false,
                };
            }
            historyByDate[d].sessions.push(s);
            historyByDate[d].totalSeconds += Number(s.durationSeconds || 0);
            historyByDate[d].goalAchieved = historyByDate[d].totalSeconds >= dailyGoalSeconds;
        }
        return {
            todayDate,
            todayTotalSeconds: todaySeconds,
            dailyGoalSeconds,
            goalProgressPercent,
            isGoalAchieved,
            remainingSeconds,
            activeSession,
            totalSessions: sessions.length,
            sessions,
            historyByDate: Object.values(historyByDate),
        };
    }
    async getAdminLiveSessions() {
        const runningSessions = await this.timeLogRepo.find({
            where: { status: time_log_entity_1.TimeLogStatus.RUNNING },
            order: { clockInTime: 'ASC' },
        });
        const now = Date.now();
        return runningSessions.map((s) => {
            const currentElapsedSeconds = Math.max(0, Math.round((now - new Date(s.clockInTime).getTime()) / 1000));
            return {
                ...s,
                currentElapsedSeconds,
            };
        });
    }
    async getAdminAllSessions(query) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;
        const qb = this.timeLogRepo.createQueryBuilder('log');
        if (query.userId && query.userId !== 'ALL') {
            qb.andWhere('log.userId = :userId', { userId: query.userId });
        }
        if (query.search && query.search.trim()) {
            const term = `%${query.search.trim().toLowerCase()}%`;
            qb.andWhere('(LOWER(log.userName) LIKE :term OR LOWER(log.userEmail) LIKE :term OR LOWER(log.department) LIKE :term OR LOWER(log.designation) LIKE :term OR LOWER(log.note) LIKE :term)', { term });
        }
        if (query.date) {
            qb.andWhere('log.date = :date', { date: query.date });
        }
        if (query.startDate) {
            qb.andWhere('log.date >= :startDate', { startDate: query.startDate });
        }
        if (query.endDate) {
            qb.andWhere('log.date <= :endDate', { endDate: query.endDate });
        }
        if (query.status && query.status !== 'ALL') {
            qb.andWhere('log.status = :status', { status: query.status.toUpperCase() });
        }
        qb.orderBy('log.clockInTime', 'DESC');
        qb.skip(skip).take(limit);
        const [sessions, total] = await qb.getManyAndCount();
        return {
            sessions,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async getAdminDailyReport(targetDate) {
        const now = new Date();
        const date = targetDate || now.toISOString().split('T')[0];
        const allUsers = await this.userRepo.find({
            relations: { department: true, designation: true },
        });
        const employees = allUsers.filter((u) => u.role !== user_entity_1.UserRole.CLIENT);
        const logs = await this.timeLogRepo.find({
            where: { date },
            order: { clockInTime: 'ASC' },
        });
        const dailyGoalSeconds = this.DAILY_GOAL_SECONDS;
        let totalCompanySeconds = 0;
        let totalAchievedCount = 0;
        let totalInProgressCount = 0;
        let totalShortHoursCount = 0;
        let totalAbsentCount = 0;
        const employeeReports = employees.map((emp) => {
            const empLogs = logs.filter((l) => l.userId === emp.id);
            let totalDurationSeconds = 0;
            let isRunning = false;
            let firstClockIn = null;
            let lastClockOut = null;
            let clockInPhoto = null;
            let clockOutPhoto = null;
            const notes = [];
            if (empLogs.length > 0) {
                firstClockIn = empLogs[0].clockInTime;
                clockInPhoto = empLogs[0].clockInPhoto;
                for (const log of empLogs) {
                    if (log.status === time_log_entity_1.TimeLogStatus.RUNNING) {
                        isRunning = true;
                        const elapsed = Math.max(0, Math.round((now.getTime() - new Date(log.clockInTime).getTime()) / 1000));
                        totalDurationSeconds += elapsed;
                    }
                    else {
                        totalDurationSeconds += Number(log.durationSeconds || 0);
                    }
                    if (log.clockOutTime) {
                        lastClockOut = log.clockOutTime;
                    }
                    if (log.clockOutPhoto) {
                        clockOutPhoto = log.clockOutPhoto;
                    }
                    if (log.note) {
                        notes.push(log.note);
                    }
                }
            }
            totalCompanySeconds += totalDurationSeconds;
            const isAchieved = totalDurationSeconds >= dailyGoalSeconds;
            let complianceStatus = 'ABSENT';
            if (empLogs.length === 0) {
                complianceStatus = 'ABSENT';
                totalAbsentCount++;
            }
            else if (isAchieved) {
                complianceStatus = 'ACHIEVED';
                totalAchievedCount++;
            }
            else if (isRunning) {
                complianceStatus = 'IN_PROGRESS';
                totalInProgressCount++;
            }
            else {
                complianceStatus = 'SHORT_HOURS';
                totalShortHoursCount++;
            }
            const progressPercent = Math.min(100, Math.round((totalDurationSeconds / dailyGoalSeconds) * 100));
            return {
                userId: emp.id,
                userName: emp.name,
                userEmail: emp.email,
                userRole: emp.role,
                userPicture: emp.picture,
                department: emp.department?.name || 'General',
                designation: emp.designation?.title || 'Staff',
                date,
                totalDurationSeconds,
                formattedHours: this.formatSecondsToHoursMinutes(totalDurationSeconds),
                progressPercent,
                isAchieved,
                isRunning,
                complianceStatus,
                sessionCount: empLogs.length,
                firstClockIn,
                lastClockOut,
                clockInPhoto,
                clockOutPhoto,
                notes: notes.join(' • ') || '—',
            };
        });
        return {
            date,
            dailyGoalHours: 6,
            dailyGoalSeconds,
            totalEmployees: employees.length,
            totalCompanySeconds,
            totalCompanyHoursFormatted: this.formatSecondsToHoursMinutes(totalCompanySeconds),
            totalAchievedCount,
            totalInProgressCount,
            totalShortHoursCount,
            totalAbsentCount,
            complianceRate: employees.length > 0 ? Math.round((totalAchievedCount / employees.length) * 100) : 0,
            reports: employeeReports,
        };
    }
    async getUserDurationForDate(userId, date) {
        const logs = await this.timeLogRepo.find({
            where: { userId, date },
        });
        return logs.reduce((acc, curr) => acc + Number(curr.durationSeconds || 0), 0);
    }
    formatSecondsToHoursMinutes(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hrs.toString().padStart(2, '0')}h ${mins.toString().padStart(2, '0')}m`;
    }
    async seedInitialTimeLogsIfEmpty() {
        const count = await this.timeLogRepo.count();
        if (count > 0)
            return;
        this.logger.log('Seeding initial employee work tracking logs with 6-hour attendance data...');
        const allUsers = await this.userRepo.find({
            relations: { department: true, designation: true },
            take: 10,
        });
        const staff = allUsers.filter((u) => u.role !== user_entity_1.UserRole.CLIENT);
        if (staff.length === 0)
            return;
        const now = new Date();
        const todayDate = now.toISOString().split('T')[0];
        for (let i = 0; i < staff.length; i++) {
            const user = staff[i];
            const isAchieved = i < 3;
            const isRunning = i === 3;
            const duration = isAchieved ? 6 * 3600 + (i * 900) : (isRunning ? 3.5 * 3600 : 4 * 3600);
            const clockIn = new Date(now.getTime() - duration * 1000);
            const clockOut = isRunning ? null : now;
            const clockInPhoto = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="100%" height="100%" fill="%231e293b"/><text x="50%" y="45%" fill="%2338bdf8" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="bold">CLOCK-IN CAMERA SNAP</text><text x="50%" y="60%" fill="%23ffffff" font-size="16" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(user.name)}</text><text x="50%" y="75%" fill="%2394a3b8" font-size="11" font-family="monospace" text-anchor="middle">VERIFIED SNAPSHOT</text></svg>`;
            const clockOutPhoto = isRunning ? null : `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect width="100%" height="100%" fill="%230f172a"/><text x="50%" y="45%" fill="%23a855f7" font-size="14" font-family="sans-serif" text-anchor="middle" font-weight="bold">CLOCK-OUT CAMERA SNAP</text><text x="50%" y="60%" fill="%23ffffff" font-size="16" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(user.name)}</text><text x="50%" y="75%" fill="%2394a3b8" font-size="11" font-family="monospace" text-anchor="middle">WORK COMPLETED</text></svg>`;
            const log = this.timeLogRepo.create({
                userId: user.id,
                userName: user.name,
                userEmail: user.email,
                userRole: user.role,
                userPicture: user.picture,
                department: user.department?.name || 'Development',
                designation: user.designation?.title || 'Engineer',
                date: todayDate,
                clockInTime: clockIn,
                clockOutTime: clockOut,
                clockInPhoto,
                clockOutPhoto,
                durationSeconds: isRunning ? 0 : duration,
                status: isRunning ? time_log_entity_1.TimeLogStatus.RUNNING : time_log_entity_1.TimeLogStatus.COMPLETED,
                note: isAchieved
                    ? 'Completed daily 6-hour work quota. Developed frontend components & API tests.'
                    : (isRunning ? 'Currently active work session in progress' : 'Partial daily shift completed'),
                ipAddress: '103.205.71.18',
                device: 'MacBook Pro / Chrome Camera',
            });
            await this.timeLogRepo.save(log);
        }
        this.logger.log('Initial employee work attendance sessions successfully seeded.');
    }
};
exports.TimeTrackerService = TimeTrackerService;
exports.TimeTrackerService = TimeTrackerService = TimeTrackerService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(time_log_entity_1.TimeLog)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TimeTrackerService);
//# sourceMappingURL=time-tracker.service.js.map