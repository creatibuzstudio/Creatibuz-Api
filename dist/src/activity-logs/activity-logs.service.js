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
var ActivityLogsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const activity_log_entity_1 = require("./entities/activity-log.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ActivityLogsService = ActivityLogsService_1 = class ActivityLogsService {
    constructor(logRepo, userRepo) {
        this.logRepo = logRepo;
        this.userRepo = userRepo;
        this.logger = new common_1.Logger(ActivityLogsService_1.name);
    }
    async onModuleInit() {
        try {
            await this.seedInitialLogsIfEmpty();
        }
        catch (err) {
            this.logger.warn(`Initial activity log check/seed: ${err.message}`);
        }
    }
    async create(dto) {
        const log = this.logRepo.create({
            userId: dto.userId || null,
            userName: dto.userName || 'System User',
            userEmail: dto.userEmail || null,
            userRole: dto.userRole || 'admin',
            userPicture: dto.userPicture || null,
            action: dto.action.toUpperCase(),
            module: dto.module.toUpperCase(),
            description: dto.description,
            targetId: dto.targetId || null,
            details: dto.details ? (typeof dto.details === 'object' ? JSON.stringify(dto.details) : String(dto.details)) : null,
            ipAddress: dto.ipAddress || '127.0.0.1',
            userAgent: dto.userAgent || 'Web Console / System',
            status: dto.status ? dto.status.toUpperCase() : activity_log_entity_1.ActivityStatus.SUCCESS,
        });
        return await this.logRepo.save(log);
    }
    async findAll(query) {
        const page = Math.max(1, parseInt(query.page || '1', 10));
        const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
        const skip = (page - 1) * limit;
        const qb = this.logRepo.createQueryBuilder('log');
        if (query.search && query.search.trim()) {
            const term = `%${query.search.trim().toLowerCase()}%`;
            qb.andWhere('(LOWER(log.userName) LIKE :term OR LOWER(log.userEmail) LIKE :term OR LOWER(log.description) LIKE :term OR LOWER(log.action) LIKE :term OR LOWER(log.module) LIKE :term OR LOWER(log.ipAddress) LIKE :term)', { term });
        }
        if (query.module && query.module !== 'ALL') {
            qb.andWhere('log.module = :module', { module: query.module.toUpperCase() });
        }
        if (query.action && query.action !== 'ALL') {
            qb.andWhere('log.action = :action', { action: query.action.toUpperCase() });
        }
        if (query.status && query.status !== 'ALL') {
            qb.andWhere('log.status = :status', { status: query.status.toUpperCase() });
        }
        if (query.userId && query.userId !== 'ALL') {
            qb.andWhere('log.userId = :userId', { userId: query.userId });
        }
        if (query.startDate) {
            const start = new Date(query.startDate);
            start.setHours(0, 0, 0, 0);
            qb.andWhere('log.createdAt >= :startDate', { startDate: start });
        }
        if (query.endDate) {
            const end = new Date(query.endDate);
            end.setHours(23, 59, 59, 999);
            qb.andWhere('log.createdAt <= :endDate', { endDate: end });
        }
        qb.orderBy('log.createdAt', 'DESC');
        qb.skip(skip).take(limit);
        const [logs, total] = await qb.getManyAndCount();
        return {
            logs,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    }
    async getExportData(query) {
        const qb = this.logRepo.createQueryBuilder('log');
        if (query.search && query.search.trim()) {
            const term = `%${query.search.trim().toLowerCase()}%`;
            qb.andWhere('(LOWER(log.userName) LIKE :term OR LOWER(log.userEmail) LIKE :term OR LOWER(log.description) LIKE :term OR LOWER(log.action) LIKE :term OR LOWER(log.module) LIKE :term)', { term });
        }
        if (query.module && query.module !== 'ALL') {
            qb.andWhere('log.module = :module', { module: query.module.toUpperCase() });
        }
        if (query.action && query.action !== 'ALL') {
            qb.andWhere('log.action = :action', { action: query.action.toUpperCase() });
        }
        if (query.status && query.status !== 'ALL') {
            qb.andWhere('log.status = :status', { status: query.status.toUpperCase() });
        }
        if (query.userId && query.userId !== 'ALL') {
            qb.andWhere('log.userId = :userId', { userId: query.userId });
        }
        if (query.startDate) {
            const start = new Date(query.startDate);
            start.setHours(0, 0, 0, 0);
            qb.andWhere('log.createdAt >= :startDate', { startDate: start });
        }
        if (query.endDate) {
            const end = new Date(query.endDate);
            end.setHours(23, 59, 59, 999);
            qb.andWhere('log.createdAt <= :endDate', { endDate: end });
        }
        qb.orderBy('log.createdAt', 'DESC');
        qb.take(2000);
        return await qb.getMany();
    }
    async getStats() {
        const totalLogs = await this.logRepo.count();
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayLogs = await this.logRepo.count({
            where: {
                createdAt: (0, typeorm_2.MoreThanOrEqual)(todayStart),
            },
        });
        const uniqueUsersRaw = await this.logRepo
            .createQueryBuilder('log')
            .select('COUNT(DISTINCT(log.userId))', 'count')
            .where('log.userId IS NOT NULL')
            .getRawOne();
        const uniqueUsers = parseInt(uniqueUsersRaw?.count || '0', 10);
        const byModuleRaw = await this.logRepo
            .createQueryBuilder('log')
            .select('log.module', 'module')
            .addSelect('COUNT(log.id)', 'count')
            .groupBy('log.module')
            .getRawMany();
        const byModule = {};
        for (const item of byModuleRaw) {
            byModule[item.module] = parseInt(item.count, 10);
        }
        const byActionRaw = await this.logRepo
            .createQueryBuilder('log')
            .select('log.action', 'action')
            .addSelect('COUNT(log.id)', 'count')
            .groupBy('log.action')
            .getRawMany();
        const byAction = {};
        for (const item of byActionRaw) {
            byAction[item.action] = parseInt(item.count, 10);
        }
        const topActors = await this.logRepo
            .createQueryBuilder('log')
            .select('log.userName', 'userName')
            .addSelect('log.userEmail', 'userEmail')
            .addSelect('log.userRole', 'userRole')
            .addSelect('log.userPicture', 'userPicture')
            .addSelect('COUNT(log.id)', 'totalActions')
            .where('log.userName IS NOT NULL')
            .groupBy('log.userName')
            .addGroupBy('log.userEmail')
            .addGroupBy('log.userRole')
            .addGroupBy('log.userPicture')
            .orderBy('COUNT(log.id)', 'DESC')
            .limit(5)
            .getRawMany();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const recentTrend = await this.logRepo
            .createQueryBuilder('log')
            .select("TO_CHAR(log.createdAt, 'YYYY-MM-DD')", 'date')
            .addSelect('COUNT(log.id)', 'count')
            .where('log.createdAt >= :sevenDaysAgo', { sevenDaysAgo })
            .groupBy("TO_CHAR(log.createdAt, 'YYYY-MM-DD')")
            .orderBy("TO_CHAR(log.createdAt, 'YYYY-MM-DD')", 'ASC')
            .getRawMany();
        return {
            totalLogs,
            todayLogs,
            uniqueUsers,
            byModule,
            byAction,
            topActors,
            recentTrend,
        };
    }
    async seedInitialLogsIfEmpty() {
        const count = await this.logRepo.count();
        if (count > 0)
            return;
        this.logger.log('Seeding realistic initial administrative activity logs...');
        const allUsers = await this.userRepo.find({ take: 20 });
        const ceo = allUsers.find(u => u.role === user_entity_1.UserRole.CEO || u.role?.toLowerCase() === 'ceo') || allUsers[0];
        const coo = allUsers.find(u => u.role === user_entity_1.UserRole.COO || u.role?.toLowerCase() === 'coo') || allUsers[1] || ceo;
        const hr = allUsers.find(u => u.role === user_entity_1.UserRole.HR || u.role?.toLowerCase() === 'hr') || allUsers[2] || ceo;
        const admin = allUsers.find(u => u.role === user_entity_1.UserRole.ADMIN || u.role?.toLowerCase() === 'admin') || ceo;
        const now = Date.now();
        const sampleEvents = [
            {
                user: ceo,
                action: activity_log_entity_1.ActivityAction.LOGIN,
                module: activity_log_entity_1.ActivityModule.AUTH,
                description: `${ceo?.name || 'Executive CEO'} successfully logged into Executive Dashboard via secure authentication`,
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 2,
            },
            {
                user: ceo,
                action: activity_log_entity_1.ActivityAction.DISBURSE_PAYROLL,
                module: activity_log_entity_1.ActivityModule.PAYROLL,
                description: `Disbursed monthly employee payroll and profit pool allocations for October 2026`,
                targetId: 'PAY-202610-ALL',
                details: JSON.stringify({ month: '2026-10', totalDisbursed: 14250.00, employeesPaid: 12 }),
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 3,
            },
            {
                user: coo,
                action: activity_log_entity_1.ActivityAction.WITHDRAW_SHARE,
                module: activity_log_entity_1.ActivityModule.FINANCE,
                description: `COO Executive processed monthly leadership share withdrawal voucher ($1,850.00)`,
                targetId: 'VOUCH-COO-202610',
                details: JSON.stringify({ amount: 1850, poolPercent: 15, method: 'Bank Transfer' }),
                ipAddress: '103.112.54.90',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 5,
            },
            {
                user: hr,
                action: activity_log_entity_1.ActivityAction.CREATE,
                module: activity_log_entity_1.ActivityModule.USERS,
                description: `Registered new team member profile with designation and department assignments`,
                targetId: allUsers[allUsers.length - 1]?.id || 'USER-NEW',
                details: JSON.stringify({ role: 'employee', status: 'active', department: 'Engineering' }),
                ipAddress: '182.160.102.12',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/17.4',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 8,
            },
            {
                user: admin,
                action: activity_log_entity_1.ActivityAction.UPDATE_SETTINGS,
                module: activity_log_entity_1.ActivityModule.SETTINGS,
                description: `Updated Corporate Finance Profit Sharing ratios: Leadership Pool 30%, Employee Pool 30%, Treasury 40%`,
                targetId: 'FIN-SETTINGS-GLOBAL',
                details: JSON.stringify({ leadershipPool: 30, employeePool: 30, companyPool: 40 }),
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 12,
            },
            {
                user: ceo,
                action: activity_log_entity_1.ActivityAction.CREATE,
                module: activity_log_entity_1.ActivityModule.ORDERS,
                description: `Created new Client Project Order #ORD-2026-0042 (Enterprise SaaS Platform Development)`,
                targetId: 'ORD-2026-0042',
                details: JSON.stringify({ budget: 8500, advance: 4250, client: 'Acme Global Corp' }),
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 18,
            },
            {
                user: hr,
                action: activity_log_entity_1.ActivityAction.UPDATE,
                module: activity_log_entity_1.ActivityModule.USERS,
                description: `Updated team member profile details, birthday alerts, and pool compensation share`,
                targetId: allUsers[0]?.id || 'USER-1',
                details: JSON.stringify({ field: 'dateOfBirth, salaryShare', updatedBy: hr?.name }),
                ipAddress: '182.160.102.12',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/17.4',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 24,
            },
            {
                user: coo,
                action: activity_log_entity_1.ActivityAction.APPROVE_EXPENSE,
                module: activity_log_entity_1.ActivityModule.FINANCE,
                description: `Approved operational server infrastructure & cloud hosting expense voucher #EXP-2026-019`,
                targetId: 'EXP-2026-019',
                details: JSON.stringify({ vendor: 'AWS Cloud Services', amount: 640.00, status: 'approved' }),
                ipAddress: '103.112.54.90',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 32,
            },
            {
                user: admin,
                action: activity_log_entity_1.ActivityAction.CREATE,
                module: activity_log_entity_1.ActivityModule.BLOGS,
                description: `Published new technical case study article on Creatibuz Studio showcase portal`,
                targetId: 'POST-DESIGN-SYSTEM',
                details: JSON.stringify({ title: 'Next-Gen Enterprise Design Systems', published: true }),
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 48,
            },
            {
                user: ceo,
                action: activity_log_entity_1.ActivityAction.EXPORT_REPORT,
                module: activity_log_entity_1.ActivityModule.PAYROLL,
                description: `Exported corporate financial payroll ledger and statement report for Q3 auditing`,
                targetId: 'REP-PAYROLL-Q3',
                details: JSON.stringify({ format: 'PDF Statement', period: '2026-Q3' }),
                ipAddress: '103.205.71.18',
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
                status: activity_log_entity_1.ActivityStatus.SUCCESS,
                offsetHours: 56,
            },
        ];
        for (const ev of sampleEvents) {
            const log = this.logRepo.create({
                userId: ev.user?.id || null,
                userName: ev.user?.name || 'Administrator',
                userEmail: ev.user?.email || 'admin@creatibuzstudio.com',
                userRole: ev.user?.role || 'admin',
                userPicture: ev.user?.picture || null,
                action: ev.action,
                module: ev.module,
                description: ev.description,
                targetId: ev.targetId || null,
                details: ev.details || null,
                ipAddress: ev.ipAddress,
                userAgent: ev.userAgent,
                status: ev.status,
                createdAt: new Date(now - ev.offsetHours * 3600 * 1000),
            });
            await this.logRepo.save(log);
        }
        this.logger.log('Initial activity logs successfully seeded.');
    }
};
exports.ActivityLogsService = ActivityLogsService;
exports.ActivityLogsService = ActivityLogsService = ActivityLogsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(activity_log_entity_1.ActivityLog)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ActivityLogsService);
//# sourceMappingURL=activity-logs.service.js.map