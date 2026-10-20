import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, MoreThanOrEqual, LessThanOrEqual, Repository } from 'typeorm';
import { ActivityAction, ActivityLog, ActivityModule, ActivityStatus } from './entities/activity-log.entity';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';
import { QueryActivityLogDto } from './dto/query-activity-log.dto';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class ActivityLogsService implements OnModuleInit {
  private readonly logger = new Logger(ActivityLogsService.name);

  constructor(
    @InjectRepository(ActivityLog)
    private readonly logRepo: Repository<ActivityLog>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async onModuleInit() {
    try {
      await this.seedInitialLogsIfEmpty();
      await this.fixExistingSystemAdministratorLogs();
    } catch (err) {
      this.logger.warn(`Initial activity log check/seed: ${err.message}`);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (!id) return null;
      return await this.userRepo.findOne({ where: { id } });
    } catch {
      return null;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      if (!email) return null;
      return await this.userRepo.findOne({ where: { email } });
    } catch {
      return null;
    }
  }

  async fixExistingSystemAdministratorLogs() {
    try {
      const logsToFix = await this.logRepo.find({
        where: [
          { userName: 'System Administrator' },
          { userName: 'System User' },
        ],
        take: 300,
      });

      for (const log of logsToFix) {
        let dbUser: User | null = null;
        if (log.userId) {
          dbUser = await this.getUserById(log.userId);
        } else if (log.userEmail) {
          dbUser = await this.getUserByEmail(log.userEmail);
        }

        if (dbUser) {
          log.userName = dbUser.name || dbUser.email?.split('@')[0];
          log.userRole = dbUser.role || log.userRole;
          log.userPicture = dbUser.picture || log.userPicture;
          await this.logRepo.save(log);
        }
      }
    } catch (err) {
      this.logger.warn(`Could not fix existing admin logs: ${err.message}`);
    }
  }

  async create(dto: CreateActivityLogDto): Promise<ActivityLog> {
    let userName = dto.userName;
    let userEmail = dto.userEmail;
    let userRole = dto.userRole;
    let userPicture = dto.userPicture;
    let userId = dto.userId;

    // If userName is generic/missing, look up user from database
    if (
      !userName ||
      userName === 'System Administrator' ||
      userName === 'System User' ||
      userName === 'Admin'
    ) {
      let dbUser: User | null = null;
      if (userId) {
        dbUser = await this.getUserById(userId);
      }
      if (!dbUser && userEmail) {
        dbUser = await this.getUserByEmail(userEmail);
      }

      if (dbUser) {
        userName = dbUser.name || dbUser.email?.split('@')[0] || userName;
        userEmail = dbUser.email || userEmail;
        userRole = dbUser.role || userRole;
        userPicture = dbUser.picture || userPicture;
        userId = dbUser.id || userId;
      }
    }

    const log = this.logRepo.create({
      userId: userId || null,
      userName: userName || 'System Administrator',
      userEmail: userEmail || null,
      userRole: userRole || 'admin',
      userPicture: userPicture || null,
      action: dto.action.toUpperCase(),
      module: dto.module.toUpperCase(),
      description: dto.description,
      targetId: dto.targetId || null,
      details: dto.details ? (typeof dto.details === 'object' ? JSON.stringify(dto.details) : String(dto.details)) : null,
      ipAddress: dto.ipAddress || '127.0.0.1',
      userAgent: dto.userAgent || 'Web Console / System',
      status: dto.status ? dto.status.toUpperCase() : ActivityStatus.SUCCESS,
    });
    return await this.logRepo.save(log);
  }

  async findAll(query: QueryActivityLogDto) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit || '20', 10)));
    const skip = (page - 1) * limit;

    const qb = this.logRepo.createQueryBuilder('log');

    // Search filter across multiple fields
    if (query.search && query.search.trim()) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(log.userName) LIKE :term OR LOWER(log.userEmail) LIKE :term OR LOWER(log.description) LIKE :term OR LOWER(log.action) LIKE :term OR LOWER(log.module) LIKE :term OR LOWER(log.ipAddress) LIKE :term)',
        { term },
      );
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

  async getExportData(query: QueryActivityLogDto) {
    const qb = this.logRepo.createQueryBuilder('log');

    if (query.search && query.search.trim()) {
      const term = `%${query.search.trim().toLowerCase()}%`;
      qb.andWhere(
        '(LOWER(log.userName) LIKE :term OR LOWER(log.userEmail) LIKE :term OR LOWER(log.description) LIKE :term OR LOWER(log.action) LIKE :term OR LOWER(log.module) LIKE :term)',
        { term },
      );
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
    qb.take(2000); // up to 2000 rows for statement export

    return await qb.getMany();
  }

  async getStats() {
    const totalLogs = await this.logRepo.count();

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayLogs = await this.logRepo.count({
      where: {
        createdAt: MoreThanOrEqual(todayStart),
      },
    });

    // Unique active users
    const uniqueUsersRaw = await this.logRepo
      .createQueryBuilder('log')
      .select('COUNT(DISTINCT(log.userId))', 'count')
      .where('log.userId IS NOT NULL')
      .getRawOne();
    const uniqueUsers = parseInt(uniqueUsersRaw?.count || '0', 10);

    // Logs by module
    const byModuleRaw = await this.logRepo
      .createQueryBuilder('log')
      .select('log.module', 'module')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy('log.module')
      .getRawMany();

    const byModule: Record<string, number> = {};
    for (const item of byModuleRaw) {
      byModule[item.module] = parseInt(item.count, 10);
    }

    // Logs by action
    const byActionRaw = await this.logRepo
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(log.id)', 'count')
      .groupBy('log.action')
      .getRawMany();

    const byAction: Record<string, number> = {};
    for (const item of byActionRaw) {
      byAction[item.action] = parseInt(item.count, 10);
    }

    // Top active actors (users)
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

    // Last 7 days trend
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
    if (count > 0) return;

    this.logger.log('Seeding realistic initial administrative activity logs...');

    const allUsers = await this.userRepo.find({ take: 20 });
    const ceo = allUsers.find(u => u.role === UserRole.CEO || u.role?.toLowerCase() === 'ceo') || allUsers[0];
    const coo = allUsers.find(u => u.role === UserRole.COO || u.role?.toLowerCase() === 'coo') || allUsers[1] || ceo;
    const hr = allUsers.find(u => u.role === UserRole.HR || u.role?.toLowerCase() === 'hr') || allUsers[2] || ceo;
    const admin = allUsers.find(u => u.role === UserRole.ADMIN || u.role?.toLowerCase() === 'admin') || ceo;

    const now = Date.now();
    const sampleEvents = [
      {
        user: ceo,
        action: ActivityAction.LOGIN,
        module: ActivityModule.AUTH,
        description: `${ceo?.name || 'Executive CEO'} successfully logged into Executive Dashboard via secure authentication`,
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 2,
      },
      {
        user: ceo,
        action: ActivityAction.DISBURSE_PAYROLL,
        module: ActivityModule.PAYROLL,
        description: `Disbursed monthly employee payroll and profit pool allocations for October 2026`,
        targetId: 'PAY-202610-ALL',
        details: JSON.stringify({ month: '2026-10', totalDisbursed: 14250.00, employeesPaid: 12 }),
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 3,
      },
      {
        user: coo,
        action: ActivityAction.WITHDRAW_SHARE,
        module: ActivityModule.FINANCE,
        description: `COO Executive processed monthly leadership share withdrawal voucher ($1,850.00)`,
        targetId: 'VOUCH-COO-202610',
        details: JSON.stringify({ amount: 1850, poolPercent: 15, method: 'Bank Transfer' }),
        ipAddress: '103.112.54.90',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 5,
      },
      {
        user: hr,
        action: ActivityAction.CREATE,
        module: ActivityModule.USERS,
        description: `Registered new team member profile with designation and department assignments`,
        targetId: allUsers[allUsers.length - 1]?.id || 'USER-NEW',
        details: JSON.stringify({ role: 'employee', status: 'active', department: 'Engineering' }),
        ipAddress: '182.160.102.12',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/17.4',
        status: ActivityStatus.SUCCESS,
        offsetHours: 8,
      },
      {
        user: admin,
        action: ActivityAction.UPDATE_SETTINGS,
        module: ActivityModule.SETTINGS,
        description: `Updated Corporate Finance Profit Sharing ratios: Leadership Pool 30%, Employee Pool 30%, Treasury 40%`,
        targetId: 'FIN-SETTINGS-GLOBAL',
        details: JSON.stringify({ leadershipPool: 30, employeePool: 30, companyPool: 40 }),
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 12,
      },
      {
        user: ceo,
        action: ActivityAction.CREATE,
        module: ActivityModule.ORDERS,
        description: `Created new Client Project Order #ORD-2026-0042 (Enterprise SaaS Platform Development)`,
        targetId: 'ORD-2026-0042',
        details: JSON.stringify({ budget: 8500, advance: 4250, client: 'Acme Global Corp' }),
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 18,
      },
      {
        user: hr,
        action: ActivityAction.UPDATE,
        module: ActivityModule.USERS,
        description: `Updated team member profile details, birthday alerts, and pool compensation share`,
        targetId: allUsers[0]?.id || 'USER-1',
        details: JSON.stringify({ field: 'dateOfBirth, salaryShare', updatedBy: hr?.name }),
        ipAddress: '182.160.102.12',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) Safari/17.4',
        status: ActivityStatus.SUCCESS,
        offsetHours: 24,
      },
      {
        user: coo,
        action: ActivityAction.APPROVE_EXPENSE,
        module: ActivityModule.FINANCE,
        description: `Approved operational server infrastructure & cloud hosting expense voucher #EXP-2026-019`,
        targetId: 'EXP-2026-019',
        details: JSON.stringify({ vendor: 'AWS Cloud Services', amount: 640.00, status: 'approved' }),
        ipAddress: '103.112.54.90',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/129.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 32,
      },
      {
        user: admin,
        action: ActivityAction.CREATE,
        module: ActivityModule.BLOGS,
        description: `Published new technical case study article on Creatibuz Studio showcase portal`,
        targetId: 'POST-DESIGN-SYSTEM',
        details: JSON.stringify({ title: 'Next-Gen Enterprise Design Systems', published: true }),
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
        offsetHours: 48,
      },
      {
        user: ceo,
        action: ActivityAction.EXPORT_REPORT,
        module: ActivityModule.PAYROLL,
        description: `Exported corporate financial payroll ledger and statement report for Q3 auditing`,
        targetId: 'REP-PAYROLL-Q3',
        details: JSON.stringify({ format: 'PDF Statement', period: '2026-Q3' }),
        ipAddress: '103.205.71.18',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) Chrome/128.0',
        status: ActivityStatus.SUCCESS,
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
}
