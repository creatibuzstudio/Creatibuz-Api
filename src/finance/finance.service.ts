import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvestorCapital } from './entities/investor-capital.entity';
import { FinancialSetting } from './entities/financial-setting.entity';
import { CompanyExpense, ExpenseStatus } from './entities/company-expense.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateCapitalDto } from './dto/create-capital.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApproveExpenseDto } from './dto/approve-expense.dto';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(InvestorCapital)
    private readonly capitalRepository: Repository<InvestorCapital>,

    @InjectRepository(FinancialSetting)
    private readonly settingRepository: Repository<FinancialSetting>,

    @InjectRepository(CompanyExpense)
    private readonly expenseRepository: Repository<CompanyExpense>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // -------------------------------------------------------------
  // 1. SETTINGS & DYNAMIC DISTRIBUTION ENGINE
  // -------------------------------------------------------------
  async getSettings(): Promise<FinancialSetting & { ceoUser?: any; cooUser?: any }> {
    let setting = await this.settingRepository.findOne({
      order: { createdAt: 'ASC' },
    });

    if (!setting) {
      setting = this.settingRepository.create({
        companyCostPercent: 40,
        employeePoolPercent: 30,
        leadershipPoolPercent: 30,
        ceoShareRatio: 60,
        cooShareRatio: 40,
        autoDeductCostFromCompanyFund: true,
      });
      setting = await this.settingRepository.save(setting);
    }

    // Resolve CEO and COO user accounts from User entity
    let ceoUser: any = null;
    let cooUser: any = null;

    if (setting.ceoUserId) {
      ceoUser = await this.userRepository.findOne({
        where: { id: setting.ceoUserId },
        relations: { designation: true, department: true },
      });
    }
    if (!ceoUser) {
      const allUsers = await this.userRepository.find({
        relations: { designation: true, department: true },
      });
      ceoUser = allUsers.find((u) => u.role?.toLowerCase() === 'ceo') || null;
      if (ceoUser && !setting.ceoUserId) {
        setting.ceoUserId = ceoUser.id;
        await this.settingRepository.save(setting);
      }
    }

    if (setting.cooUserId) {
      cooUser = await this.userRepository.findOne({
        where: { id: setting.cooUserId },
        relations: { designation: true, department: true },
      });
    }
    if (!cooUser) {
      const allUsers = await this.userRepository.find({
        relations: { designation: true, department: true },
      });
      cooUser = allUsers.find((u) => u.role?.toLowerCase() === 'coo') || null;
      if (cooUser && !setting.cooUserId) {
        setting.cooUserId = cooUser.id;
        await this.settingRepository.save(setting);
      }
    }

    return {
      ...setting,
      ceoUser,
      cooUser,
    };
  }

  async updateSettings(dto: UpdateSettingsDto): Promise<FinancialSetting> {
    let setting = await this.settingRepository.findOne({
      order: { createdAt: 'ASC' },
    });

    if (!setting) {
      setting = this.settingRepository.create(dto);
    } else {
      Object.assign(setting, dto);
    }

    if (dto.ceoPercent !== undefined && dto.cooPercent !== undefined) {
      setting.ceoPercent = Number(dto.ceoPercent);
      setting.cooPercent = Number(dto.cooPercent);
      setting.leadershipPoolPercent =
        dto.leadershipPoolPercent !== undefined
          ? Number(dto.leadershipPoolPercent)
          : Number((Number(dto.ceoPercent) + Number(dto.cooPercent)).toFixed(2));
      if (setting.leadershipPoolPercent > 0) {
        setting.ceoShareRatio = Number(
          ((Number(dto.ceoPercent) / setting.leadershipPoolPercent) * 100).toFixed(2),
        );
        setting.cooShareRatio = Number(
          ((Number(dto.cooPercent) / setting.leadershipPoolPercent) * 100).toFixed(2),
        );
      }
    } else if (
      dto.leadershipPoolPercent !== undefined &&
      dto.ceoShareRatio !== undefined &&
      dto.cooShareRatio !== undefined
    ) {
      setting.leadershipPoolPercent = Number(dto.leadershipPoolPercent);
      setting.ceoShareRatio = Number(dto.ceoShareRatio);
      setting.cooShareRatio = Number(dto.cooShareRatio);
      setting.ceoPercent = Number(
        ((Number(dto.leadershipPoolPercent) * Number(dto.ceoShareRatio)) / 100).toFixed(2),
      );
      setting.cooPercent = Number(
        ((Number(dto.leadershipPoolPercent) * Number(dto.cooShareRatio)) / 100).toFixed(2),
      );
    } else if (dto.leadershipPoolPercent !== undefined) {
      setting.leadershipPoolPercent = Number(dto.leadershipPoolPercent);
      const cRatio = Number(setting.ceoShareRatio || 50);
      const oRatio = Number(setting.cooShareRatio || 50);
      setting.ceoPercent = Number(((setting.leadershipPoolPercent * cRatio) / 100).toFixed(2));
      setting.cooPercent = Number(((setting.leadershipPoolPercent * oRatio) / 100).toFixed(2));
    }

    if (dto.companyCostPercent !== undefined) {
      setting.companyCostPercent = Number(dto.companyCostPercent);
    }
    if (dto.employeePoolPercent !== undefined) {
      setting.employeePoolPercent = Number(dto.employeePoolPercent);
    }
    if (dto.ceoUserId !== undefined) {
      setting.ceoUserId = dto.ceoUserId;
    }
    if (dto.cooUserId !== undefined) {
      setting.cooUserId = dto.cooUserId;
    }
    if (dto.autoDeductCostFromCompanyFund !== undefined) {
      setting.autoDeductCostFromCompanyFund = dto.autoDeductCostFromCompanyFund;
    }

    return await this.settingRepository.save(setting);
  }

  // -------------------------------------------------------------
  // 2. INVESTOR CAPITAL
  // -------------------------------------------------------------
  async createCapital(dto: CreateCapitalDto): Promise<InvestorCapital> {
    const count = await this.capitalRepository.count();
    const invoiceNumber =
      dto.invoiceNumber ||
      `INV-CAP-${new Date().getFullYear()}-${String(count + 1001).slice(-4)}`;

    let user: User | null = null;
    if (dto.userId) {
      user = await this.userRepository.findOne({ where: { id: dto.userId } });
    }

    const item = this.capitalRepository.create({
      ...dto,
      invoiceNumber,
      user: user || undefined,
      investorName: dto.investorName || user?.name || 'Investor',
      investorEmail: dto.investorEmail || user?.email,
      investorPhone: dto.investorPhone || user?.phone,
    });
    return await this.capitalRepository.save(item);
  }

  async findAllCapitals(): Promise<InvestorCapital[]> {
    return await this.capitalRepository.find({
      relations: { user: true },
      order: { investmentDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async deleteCapital(id: string): Promise<void> {
    const item = await this.capitalRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Investor capital with ID ${id} not found`);
    await this.capitalRepository.remove(item);
  }

  // -------------------------------------------------------------
  // 3. COMPANY EXPENSES & DUAL APPROVALS
  // -------------------------------------------------------------
  async createExpense(dto: CreateExpenseDto): Promise<CompanyExpense> {
    const count = await this.expenseRepository.count();
    const voucherNumber =
      dto.voucherNumber ||
      `EXP-${new Date().getFullYear()}-${String(count + 1001).slice(-4)}`;

    const item = this.expenseRepository.create({
      ...dto,
      voucherNumber,
      status: ExpenseStatus.PENDING,
    });
    return await this.expenseRepository.save(item);
  }

  async findAllExpenses(status?: ExpenseStatus): Promise<CompanyExpense[]> {
    const where: any = {};
    if (status) {
      where.status = status;
    }
    return await this.expenseRepository.find({
      where,
      order: { expenseDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOneExpense(id: string): Promise<CompanyExpense> {
    const item = await this.expenseRepository.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Expense with ID ${id} not found`);
    return item;
  }

  async approveExpense(id: string, dto: ApproveExpenseDto): Promise<CompanyExpense> {
    const expense = await this.findOneExpense(id);

    const now = new Date().toISOString();
    const approvalRecord = {
      approved: dto.approved,
      date: now,
      userId: dto.userId || undefined,
      userName: dto.userName || (dto.role === 'ceo' ? 'CEO' : 'COO'),
      comment: dto.comment || undefined,
    };

    if (dto.role === 'ceo') {
      expense.ceoApproval = approvalRecord;
    } else if (dto.role === 'coo') {
      expense.cooApproval = approvalRecord;
    } else if (dto.role === 'admin') {
      expense.ceoApproval = approvalRecord;
      expense.cooApproval = approvalRecord;
    }

    // Evaluate dual approval workflow:
    // If any executive rejected, status becomes REJECTED
    if (
      (expense.ceoApproval && !expense.ceoApproval.approved) ||
      (expense.cooApproval && !expense.cooApproval.approved)
    ) {
      expense.status = ExpenseStatus.REJECTED;
      expense.isDisbursed = false;
    } else if (
      expense.ceoApproval?.approved &&
      expense.cooApproval?.approved
    ) {
      expense.status = ExpenseStatus.APPROVED;
      expense.isDisbursed = true;
      expense.disbursedDate = new Date();
    } else if (expense.ceoApproval?.approved) {
      expense.status = ExpenseStatus.CEO_APPROVED;
    } else if (expense.cooApproval?.approved) {
      expense.status = ExpenseStatus.COO_APPROVED;
    }

    return await this.expenseRepository.save(expense);
  }

  async deleteExpense(id: string): Promise<void> {
    const item = await this.findOneExpense(id);
    await this.expenseRepository.remove(item);
  }

  // -------------------------------------------------------------
  // 4. EXECUTIVE EXECUTIVES LIST (Role: 'ceo' | 'coo')
  // -------------------------------------------------------------
  async getExecutiveUsers(): Promise<{ ceos: User[]; coos: User[]; allUsers: User[] }> {
    const users = await this.userRepository.find({
      relations: { designation: true, department: true },
      order: { name: 'ASC' },
    });

    const ceos = users.filter(
      (u) => u.role?.toLowerCase() === 'ceo' || u.role === UserRole.CEO,
    );
    const coos = users.filter(
      (u) => u.role?.toLowerCase() === 'coo' || u.role === UserRole.COO,
    );

    return { ceos, coos, allUsers: users };
  }

  // -------------------------------------------------------------
  // 5. MASTER FINANCIAL OVERVIEW & REAL-TIME DISTRIBUTION
  // -------------------------------------------------------------
  async getOverview() {
    const settings = await this.getSettings();

    // 1. Total Inflow from Orders (advance / collected payments)
    const orders = await this.orderRepository.find();
    let totalOrderRevenue = 0;
    let totalOrderInvoiced = 0;

    orders.forEach((o) => {
      totalOrderRevenue += Number(o.advance || 0);
      const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
      const disc = Number(o.discount || 0);
      const tx = Number(o.tax || 0);
      totalOrderInvoiced += Math.max(0, sub - disc + tx);
    });

    // 2. Total Investor Capital
    const capitals = await this.capitalRepository.find();
    let totalInvestorCapital = 0;
    capitals.forEach((c) => {
      totalInvestorCapital += Number(c.amount || 0);
    });

    // 3. Total Expenses (Approved, Pending, Rejected)
    const expenses = await this.expenseRepository.find();
    let totalApprovedExpenses = 0;
    let totalPendingExpenses = 0;
    let pendingCount = 0;

    expenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      if (e.status === ExpenseStatus.APPROVED) {
        totalApprovedExpenses += amt;
      } else if (
        e.status === ExpenseStatus.PENDING ||
        e.status === ExpenseStatus.CEO_APPROVED ||
        e.status === ExpenseStatus.COO_APPROVED
      ) {
        totalPendingExpenses += amt;
        pendingCount += 1;
      }
    });

    // 4. Dynamic Percentage Allocations from Total Order Revenue
    const companyCostPercent = Number(settings.companyCostPercent || 40);
    const employeePoolPercent = Number(settings.employeePoolPercent || 30);
    let leadershipPoolPercent = Number(settings.leadershipPoolPercent || 30);

    let ceoEffectivePercent =
      settings.ceoPercent !== undefined && settings.ceoPercent !== null
        ? Number(settings.ceoPercent)
        : null;
    let cooEffectivePercent =
      settings.cooPercent !== undefined && settings.cooPercent !== null
        ? Number(settings.cooPercent)
        : null;

    if (ceoEffectivePercent === null || cooEffectivePercent === null) {
      const cRatio = Number(settings.ceoShareRatio || 60);
      const oRatio = Number(settings.cooShareRatio || 40);
      ceoEffectivePercent = (leadershipPoolPercent * cRatio) / 100;
      cooEffectivePercent = (leadershipPoolPercent * oRatio) / 100;
    } else {
      // If direct individual percentages are set (e.g. 20% and 40%),
      // ensure leadershipPoolPercent is their sum
      leadershipPoolPercent = Number((ceoEffectivePercent + cooEffectivePercent).toFixed(2));
    }

    const ceoShareRatio =
      leadershipPoolPercent > 0
        ? Number(((ceoEffectivePercent / leadershipPoolPercent) * 100).toFixed(2))
        : 50;
    const cooShareRatio =
      leadershipPoolPercent > 0
        ? Number(((cooEffectivePercent / leadershipPoolPercent) * 100).toFixed(2))
        : 50;

    const companyCostAllocated = totalOrderRevenue * (companyCostPercent / 100);
    const companyCostNetBalance = Math.max(0, companyCostAllocated - totalApprovedExpenses);

    const employeePoolAllocated = totalOrderRevenue * (employeePoolPercent / 100);
    const leadershipPoolAllocated = totalOrderRevenue * (leadershipPoolPercent / 100);

    // Individual Shares for CEO and COO (directly based on their individual percent)
    const ceoShareAmount = totalOrderRevenue * (ceoEffectivePercent / 100);
    const cooShareAmount = totalOrderRevenue * (cooEffectivePercent / 100);

    // Net Treasury Balance = Capital + Order Revenue - Approved Costs
    const totalTreasuryBalance = totalInvestorCapital + totalOrderRevenue - totalApprovedExpenses;

    return {
      summary: {
        totalInvestorCapital,
        totalOrderRevenue,
        totalOrderInvoiced,
        totalApprovedExpenses,
        totalPendingExpenses,
        pendingExpenseCount: pendingCount,
        totalTreasuryBalance,
      },
      pools: {
        companyCost: {
          percent: companyCostPercent,
          allocated: companyCostAllocated,
          spent: totalApprovedExpenses,
          netBalance: companyCostNetBalance,
        },
        employeePool: {
          percent: employeePoolPercent,
          allocated: employeePoolAllocated,
        },
        leadershipPool: {
          percent: leadershipPoolPercent,
          allocated: leadershipPoolAllocated,
          ceoPercent: Number(ceoEffectivePercent.toFixed(2)),
          cooPercent: Number(cooEffectivePercent.toFixed(2)),
          ceoShareRatio,
          cooShareRatio,
          ceoShareAmount: Number(ceoShareAmount.toFixed(2)),
          cooShareAmount: Number(cooShareAmount.toFixed(2)),
          ceoEffectivePercent: Number(ceoEffectivePercent.toFixed(2)),
          cooEffectivePercent: Number(cooEffectivePercent.toFixed(2)),
        },
      },
      executives: {
        ceo: {
          user: settings.ceoUser,
          percent: Number(ceoEffectivePercent.toFixed(2)),
          shareRatioOfLeadership: ceoShareRatio,
          effectivePercentOfTotalRevenue: Number(ceoEffectivePercent.toFixed(2)),
          totalEarnings: Number(ceoShareAmount.toFixed(2)),
        },
        coo: {
          user: settings.cooUser,
          percent: Number(cooEffectivePercent.toFixed(2)),
          shareRatioOfLeadership: cooShareRatio,
          effectivePercentOfTotalRevenue: Number(cooEffectivePercent.toFixed(2)),
          totalEarnings: Number(cooShareAmount.toFixed(2)),
        },
      },
      executivesList: [
        {
          key: 'ceo',
          roleKey: 'ceo',
          roleTitle: 'Chief Executive Officer (CEO)',
          user: settings.ceoUser,
          shareRatioOfLeadership: ceoShareRatio,
          effectivePercentOfTotalRevenue: Number(ceoEffectivePercent.toFixed(2)),
          totalEarnings: Number(ceoShareAmount.toFixed(2)),
        },
        {
          key: 'coo',
          roleKey: 'coo',
          roleTitle: 'Chief Operating Officer (COO)',
          user: settings.cooUser,
          shareRatioOfLeadership: cooShareRatio,
          effectivePercentOfTotalRevenue: Number(cooEffectivePercent.toFixed(2)),
          totalEarnings: Number(cooShareAmount.toFixed(2)),
        },
      ],
      settings,
    };
  }
}
