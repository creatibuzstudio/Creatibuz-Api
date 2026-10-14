import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  MonthlyPayroll,
  PayrollStatus,
} from './entities/monthly-payroll.entity';
import {
  PayrollItem,
  PayrollItemStatus,
  PayrollRecipientType,
} from './entities/payroll-item.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { DisbursePayrollDto } from './dto/disburse-payroll.dto';
import { WithdrawExecutiveDto } from './dto/withdraw-executive.dto';

@Injectable()
export class PayrollService {
  constructor(
    @InjectRepository(MonthlyPayroll)
    private readonly payrollRepository: Repository<MonthlyPayroll>,

    @InjectRepository(PayrollItem)
    private readonly itemRepository: Repository<PayrollItem>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(FinancialSetting)
    private readonly settingRepository: Repository<FinancialSetting>,
  ) {}

  private getMonthName(monthYear: string): string {
    const [year, month] = monthYear.split('-').map(Number);
    const date = new Date(year, month - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // -------------------------------------------------------------
  // 1. GET MONTHLY PAYROLL SUMMARY / PREVIEW
  // -------------------------------------------------------------
  async getMonthlySummary(requestedMonth?: string) {
    const now = new Date();
    const currentMonthYear = `${now.getFullYear()}-${String(
      now.getMonth() + 1,
    ).padStart(2, '0')}`;
    const monthYear = requestedMonth || currentMonthYear;
    const monthName = this.getMonthName(monthYear);

    // 1. Fetch Financial Distribution Settings
    const settingsList = await this.settingRepository.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    const settings = settingsList[0] || {
      companyCostPercent: 40,
      employeePoolPercent: 30,
      leadershipPoolPercent: 30,
      ceoPercent: 20,
      cooPercent: 40,
      ceoShareRatio: 60,
      cooShareRatio: 40,
    };

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
      leadershipPoolPercent = Number(
        (ceoEffectivePercent + cooEffectivePercent).toFixed(2),
      );
    }

    // 2. Fetch Orders & Calculate Monthly and All-Time Inflows
    const allOrders = await this.orderRepository.find();
    let monthSpecificRevenue = 0;
    let allTimeRevenue = 0;

    allOrders.forEach((o) => {
      const sub =
        o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
      const disc = Number(o.discount || 0);
      const tx = Number(o.tax || 0);
      const orderInvoiced = Math.max(0, sub - disc + tx) || Number(o.budget || 0);
      const adv = Number(o.advance || 0);
      const pmtSum = Array.isArray(o.payments)
        ? o.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
        : 0;
      const isPaid = String(o.paymentStatus || '').toLowerCase() === 'paid';
      const orderPaid = isPaid
        ? Math.max(orderInvoiced, adv, pmtSum)
        : Math.max(adv, pmtSum);

      allTimeRevenue += orderPaid;

      // Check if order was created in this month or payments made in this month
      const createdMonth = o.createdAt
        ? new Date(o.createdAt).toISOString().slice(0, 7)
        : '';
      let hasPaymentInMonth = false;
      let monthPaymentAmount = 0;

      if (Array.isArray(o.payments)) {
        o.payments.forEach((p) => {
          const pDate = p.paymentDate || p.createdAt || '';
          if (pDate.startsWith(monthYear)) {
            hasPaymentInMonth = true;
            monthPaymentAmount += Number(p.amount || 0);
          }
        });
      }

      if (createdMonth === monthYear) {
        monthSpecificRevenue += orderPaid;
      } else if (hasPaymentInMonth) {
        monthSpecificRevenue += monthPaymentAmount;
      }
    });

    // Use month-specific revenue if available; otherwise use all-time revenue
    // so user can process from active funds without zero block
    const effectiveMonthlyRevenue =
      monthSpecificRevenue > 0 ? monthSpecificRevenue : allTimeRevenue;

    // 3. Calculate Pool Allocations
    const employeePoolAllocated = Number(
      ((effectiveMonthlyRevenue * employeePoolPercent) / 100).toFixed(2),
    );
    const ceoShareAmount = Number(
      ((effectiveMonthlyRevenue * ceoEffectivePercent) / 100).toFixed(2),
    );
    const cooShareAmount = Number(
      ((effectiveMonthlyRevenue * cooEffectivePercent) / 100).toFixed(2),
    );
    const companyCostAllocated = Number(
      ((effectiveMonthlyRevenue * companyCostPercent) / 100).toFixed(2),
    );

    // 4. Fetch Users (Employees, CEO, COO)
    const allUsers = await this.userRepository.find({
      relations: { department: true, designation: true },
      order: { order: 'ASC', name: 'ASC' },
    });

    const ceoUser =
      allUsers.find(
        (u) =>
          u.role?.toLowerCase() === 'ceo' || u.role === UserRole.CEO,
      ) || null;
    const cooUser =
      allUsers.find(
        (u) =>
          u.role?.toLowerCase() === 'coo' || u.role === UserRole.COO,
      ) || null;

    // Eligible employees: exclude client, exclude ceo, exclude coo
    const eligibleEmployees = allUsers.filter((u) => {
      const r = (u.role || '').toLowerCase();
      return r !== 'client' && r !== 'ceo' && r !== 'coo';
    });

    const totalEligibleCount = eligibleEmployees.length;
    let totalAllocatedPercent = 0;
    eligibleEmployees.forEach((emp) => {
      totalAllocatedPercent += Number(emp.salary || 0);
    });

    const unallocatedPercent = Math.max(0, Number((100 - totalAllocatedPercent).toFixed(2)));
    const unallocatedAmount = Number(
      ((employeePoolAllocated * unallocatedPercent) / 100).toFixed(2),
    );

    // 5. Check if MonthlyPayroll entity already saved in DB
    const existingPayroll = await this.payrollRepository.findOne({
      where: { monthYear },
      relations: { items: true },
    });

    const savedItems = existingPayroll?.items || [];
    const ceoItem = savedItems.find((i) => i.type === PayrollRecipientType.CEO);
    const cooItem = savedItems.find((i) => i.type === PayrollRecipientType.COO);

    const isCeoWithdrawn =
      ceoItem?.paymentStatus === PayrollItemStatus.WITHDRAWN ||
      ceoItem?.paymentStatus === PayrollItemStatus.PAID;
    const isCooWithdrawn =
      cooItem?.paymentStatus === PayrollItemStatus.WITHDRAWN ||
      cooItem?.paymentStatus === PayrollItemStatus.PAID;
    const isPayrollDisbursed = existingPayroll?.status === PayrollStatus.PAID;

    // Map employees with their configured percentage of the Employee Pool
    let totalDistributedToEmployees = 0;
    const employeeItemsList = eligibleEmployees.map((emp) => {
      const saved = savedItems.find(
        (i) => i.userId === emp.id || i.recipientEmail === emp.email,
      );
      // Salary represents their percentage share of the Employee Pool
      const poolSharePercent = Number(emp.salary || 0);
      const profitShare = saved
        ? Number(saved.profitShareAmount || 0)
        : Number(((employeePoolAllocated * poolSharePercent) / 100).toFixed(2));
      const bonus = saved ? Number(saved.bonus || 0) : 0;
      const deductions = saved ? Number(saved.deductions || 0) : 0;
      const netPayable = saved
        ? Number(saved.netPayable || 0)
        : Number((profitShare + bonus - deductions).toFixed(2));

      totalDistributedToEmployees += netPayable;

      return {
        id: saved?.id || null,
        userId: emp.id,
        name: emp.name,
        email: emp.email,
        phone: emp.phone,
        picture: emp.picture,
        role: emp.role,
        department: emp.department?.name || 'General',
        designation: emp.designation?.title || 'Team Member',
        poolSharePercent,
        baseSalary: poolSharePercent,
        profitShareAmount: profitShare,
        bonus,
        deductions,
        netPayable,
        paymentStatus: saved?.paymentStatus || PayrollItemStatus.PENDING,
        paymentMethod: saved?.paymentMethod || null,
        transactionReference: saved?.transactionReference || null,
        voucherNumber: saved?.voucherNumber || null,
        paidAt: saved?.paidAt || null,
        notes: saved?.notes || '',
      };
    });

    return {
      monthYear,
      monthName,
      isSaved: !!existingPayroll,
      payrollId: existingPayroll?.id || null,
      status: existingPayroll?.status || PayrollStatus.DRAFT,
      disbursedAt: existingPayroll?.disbursedAt || null,
      processedAt: existingPayroll?.processedAt || null,
      revenueBasis: {
        effectiveMonthlyRevenue,
        monthSpecificRevenue,
        allTimeRevenue,
        isUsingAllTimeFallback:
          monthSpecificRevenue === 0 && allTimeRevenue > 0,
      },
      pools: {
        companyCost: {
          percent: companyCostPercent,
          amount: companyCostAllocated,
        },
        employeePool: {
          percent: employeePoolPercent,
          amount: employeePoolAllocated,
          totalEligibleCount,
          totalAllocatedPercent: Number(totalAllocatedPercent.toFixed(2)),
          unallocatedPercent: Number(unallocatedPercent.toFixed(2)),
          unallocatedAmount,
          totalDistributedToEmployees: Number(totalDistributedToEmployees.toFixed(2)),
        },
        leadershipPool: {
          percent: leadershipPoolPercent,
          amount: Number((ceoShareAmount + cooShareAmount).toFixed(2)),
        },
      },
      executives: {
        ceo: {
          user: ceoUser,
          percent: ceoEffectivePercent,
          amount: ceoShareAmount,
          isWithdrawn: isCeoWithdrawn,
          item: ceoItem || null,
          canWithdraw: !isCeoWithdrawn,
        },
        coo: {
          user: cooUser,
          percent: cooEffectivePercent,
          amount: cooShareAmount,
          isWithdrawn: isCooWithdrawn,
          item: cooItem || null,
          canWithdraw: !isCooWithdrawn,
        },
      },
      employees: employeeItemsList,
      summary: {
        totalAllocatedPercent: Number(totalAllocatedPercent.toFixed(2)),
        unallocatedPercent: Number(unallocatedPercent.toFixed(2)),
        unallocatedAmount,
        totalEmployeePool: employeePoolAllocated,
        totalDistributedToEmployees: Number(totalDistributedToEmployees.toFixed(2)),
        totalEmployeePayrollGross: Number(totalDistributedToEmployees.toFixed(2)),
        isPayrollDisbursed,
      },
    };
  }

  // -------------------------------------------------------------
  // 2. GENERATE OR UPDATE MONTHLY PAYROLL
  // -------------------------------------------------------------
  async generateOrUpdatePayroll(dto: GeneratePayrollDto): Promise<MonthlyPayroll> {
    const summary = await this.getMonthlySummary(dto.monthYear);

    let payroll = await this.payrollRepository.findOne({
      where: { monthYear: dto.monthYear },
      relations: { items: true },
    });

    if (payroll && payroll.status === PayrollStatus.PAID) {
      throw new BadRequestException(
        `Payroll for ${summary.monthName} has already been paid and finalized.`,
      );
    }

    if (!payroll) {
      payroll = this.payrollRepository.create({
        monthYear: dto.monthYear,
        monthName: summary.monthName,
        status: PayrollStatus.DRAFT,
      });
    }

    payroll.totalOrderRevenue = summary.revenueBasis.effectiveMonthlyRevenue;
    payroll.companyCostPercent = summary.pools.companyCost.percent;
    payroll.companyCostAmount = summary.pools.companyCost.amount;
    payroll.employeePoolPercent = summary.pools.employeePool.percent;
    payroll.employeePoolAmount = summary.pools.employeePool.amount;
    payroll.leadershipPoolPercent = summary.pools.leadershipPool.percent;
    payroll.leadershipPoolAmount = summary.pools.leadershipPool.amount;
    payroll.ceoPercent = summary.executives.ceo.percent;
    payroll.ceoAmount = summary.executives.ceo.amount;
    payroll.cooPercent = summary.executives.coo.percent;
    payroll.cooAmount = summary.executives.coo.amount;
    payroll.totalBaseSalary = summary.summary.totalDistributedToEmployees;
    payroll.totalProfitShare = summary.summary.totalDistributedToEmployees;
    payroll.processedAt = new Date();
    payroll.processedBy = dto.processedBy || 'Administrator';
    if (dto.notes) payroll.notes = dto.notes;

    payroll = await this.payrollRepository.save(payroll);

    // Existing items map
    const existingItems = payroll.items || [];
    const itemMap = new Map<string, PayrollItem>();
    existingItems.forEach((it) => {
      if (it.userId) itemMap.set(it.userId, it);
      if (it.type === PayrollRecipientType.CEO) itemMap.set('role-ceo', it);
      if (it.type === PayrollRecipientType.COO) itemMap.set('role-coo', it);
    });

    const itemsToSave: PayrollItem[] = [];

    // 1. Process Employee Items (Strictly based on their % of Employee Pool)
    summary.employees.forEach((emp, index) => {
      let item = itemMap.get(emp.userId);
      const custom = dto.customItems?.find((c) => c.userId === emp.userId);
      const bonus = custom?.bonus !== undefined ? Number(custom.bonus) : emp.bonus;
      const deductions =
        custom?.deductions !== undefined
          ? Number(custom.deductions)
          : emp.deductions;
      const profitShare = emp.profitShareAmount;
      const netPayable = Number(
        (profitShare + bonus - deductions).toFixed(2),
      );

      if (!item) {
        item = this.itemRepository.create({
          monthlyPayroll: payroll,
          monthlyPayrollId: payroll.id,
          userId: emp.userId,
          recipientName: emp.name,
          recipientEmail: emp.email,
          recipientRole: emp.role,
          department: emp.department,
          designation: emp.designation,
          type: PayrollRecipientType.EMPLOYEE,
          paymentStatus: PayrollItemStatus.PENDING,
          voucherNumber: `PAY-${dto.monthYear.replace('-', '')}-${String(
            index + 1001,
          ).slice(-4)}`,
        });
      }

      item.baseSalary = emp.poolSharePercent;
      item.profitSharePercent = emp.poolSharePercent;
      item.profitShareAmount = profitShare;
      item.bonus = bonus;
      item.deductions = deductions;
      item.netPayable = netPayable;
      if (custom?.notes) item.notes = custom.notes;

      itemsToSave.push(item);
    });

    // 2. Process CEO Item
    if (summary.executives.ceo.user) {
      const ceoUser = summary.executives.ceo.user;
      let ceoItem = itemMap.get('role-ceo') || itemMap.get(ceoUser.id);
      if (!ceoItem) {
        ceoItem = this.itemRepository.create({
          monthlyPayroll: payroll,
          monthlyPayrollId: payroll.id,
          userId: ceoUser.id,
          recipientName: ceoUser.name,
          recipientEmail: ceoUser.email,
          recipientRole: 'ceo',
          department: ceoUser.department?.name || 'Executive',
          designation: ceoUser.designation?.title || 'Chief Executive Officer',
          type: PayrollRecipientType.CEO,
          paymentStatus: PayrollItemStatus.PENDING,
          voucherNumber: `DIV-CEO-${dto.monthYear.replace('-', '')}`,
        });
      }
      ceoItem.profitSharePercent = summary.executives.ceo.percent;
      ceoItem.profitShareAmount = summary.executives.ceo.amount;
      ceoItem.netPayable = summary.executives.ceo.amount;
      itemsToSave.push(ceoItem);
    }

    // 3. Process COO Item
    if (summary.executives.coo.user) {
      const cooUser = summary.executives.coo.user;
      let cooItem = itemMap.get('role-coo') || itemMap.get(cooUser.id);
      if (!cooItem) {
        cooItem = this.itemRepository.create({
          monthlyPayroll: payroll,
          monthlyPayrollId: payroll.id,
          userId: cooUser.id,
          recipientName: cooUser.name,
          recipientEmail: cooUser.email,
          recipientRole: 'coo',
          department: cooUser.department?.name || 'Executive',
          designation: cooUser.designation?.title || 'Chief Operating Officer',
          type: PayrollRecipientType.COO,
          paymentStatus: PayrollItemStatus.PENDING,
          voucherNumber: `DIV-COO-${dto.monthYear.replace('-', '')}`,
        });
      }
      cooItem.profitSharePercent = summary.executives.coo.percent;
      cooItem.profitShareAmount = summary.executives.coo.amount;
      cooItem.netPayable = summary.executives.coo.amount;
      itemsToSave.push(cooItem);
    }

    await this.itemRepository.save(itemsToSave);

    return (await this.payrollRepository.findOne({
      where: { id: payroll.id },
      relations: { items: true },
    })) as MonthlyPayroll;
  }

  // -------------------------------------------------------------
  // 3. EXECUTIVE WITHDRAWAL (Enforces ONCE-A-MONTH rule)
  // -------------------------------------------------------------
  async withdrawExecutiveShare(dto: WithdrawExecutiveDto) {
    const roleKey = dto.role?.toLowerCase() as 'ceo' | 'coo';
    if (roleKey !== 'ceo' && roleKey !== 'coo') {
      throw new BadRequestException('Role must be either ceo or coo');
    }

    // Ensure payroll exists for this month
    let payroll = await this.payrollRepository.findOne({
      where: { monthYear: dto.monthYear },
      relations: { items: true },
    });

    if (!payroll) {
      payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
    }

    const recipientType =
      roleKey === 'ceo' ? PayrollRecipientType.CEO : PayrollRecipientType.COO;
    let item = payroll.items?.find((i) => i.type === recipientType);

    if (!item) {
      // Re-generate to ensure executive item exists
      payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
      item = payroll.items?.find((i) => i.type === recipientType);
    }

    if (!item) {
      throw new NotFoundException(
        `Executive record for ${roleKey.toUpperCase()} not found for ${dto.monthYear}. Please check executive assignment.`,
      );
    }

    // STRICT ONCE-A-MONTH CONSTRAINT:
    if (
      item.paymentStatus === PayrollItemStatus.WITHDRAWN ||
      item.paymentStatus === PayrollItemStatus.PAID
    ) {
      throw new BadRequestException(
        `${roleKey.toUpperCase()} has already withdrawn their share for ${dto.monthYear} on ${new Date(
          item.paidAt,
        ).toLocaleDateString()}. Withdrawals are restricted to once per calendar month.`,
      );
    }

    item.paymentStatus = PayrollItemStatus.WITHDRAWN;
    item.paymentMethod = dto.paymentMethod || 'bank_transfer';
    item.transactionReference =
      dto.transactionReference ||
      `TRX-WD-${Date.now().toString().slice(-8)}`;
    item.voucherNumber =
      item.voucherNumber ||
      `DIV-${roleKey.toUpperCase()}-${dto.monthYear.replace('-', '')}`;
    item.paidAt = new Date();
    if (dto.notes) item.notes = dto.notes;

    const savedItem = await this.itemRepository.save(item);

    return {
      message: `${roleKey.toUpperCase()} monthly share withdrawn successfully!`,
      monthYear: dto.monthYear,
      role: roleKey,
      amountWithdrawn: savedItem.netPayable,
      voucherNumber: savedItem.voucherNumber,
      transactionReference: savedItem.transactionReference,
      paymentMethod: savedItem.paymentMethod,
      paidAt: savedItem.paidAt,
      item: savedItem,
    };
  }

  // -------------------------------------------------------------
  // 4. DISBURSE EMPLOYEE PAYROLL
  // -------------------------------------------------------------
  async disburseEmployeePayroll(dto: DisbursePayrollDto) {
    let payroll = await this.payrollRepository.findOne({
      where: { monthYear: dto.monthYear },
      relations: { items: true },
    });

    if (!payroll) {
      payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
    }

    const employeeItems =
      payroll.items?.filter((i) => i.type === PayrollRecipientType.EMPLOYEE) || [];

    if (employeeItems.length === 0) {
      throw new BadRequestException('No employee payroll records found to disburse.');
    }

    const now = new Date();
    employeeItems.forEach((item, index) => {
      item.paymentStatus = PayrollItemStatus.PAID;
      item.paymentMethod = dto.paymentMethod || item.paymentMethod || 'bank_transfer';
      if (dto.transactionReference) {
        item.transactionReference = `${dto.transactionReference}-${index + 1}`;
      }
      item.paidAt = now;
      if (!item.voucherNumber) {
        item.voucherNumber = `PAY-${dto.monthYear.replace('-', '')}-${String(
          index + 1001,
        ).slice(-4)}`;
      }
    });

    await this.itemRepository.save(employeeItems);

    payroll.status = PayrollStatus.PAID;
    payroll.disbursedAt = now;
    payroll.totalEmployeesPaid = employeeItems.length;
    if (dto.notes) payroll.notes = dto.notes;
    if (dto.processedBy) payroll.processedBy = dto.processedBy;

    await this.payrollRepository.save(payroll);

    return {
      message: `Employee payroll for ${payroll.monthName} successfully disbursed to ${employeeItems.length} employees.`,
      monthYear: dto.monthYear,
      totalEmployeesPaid: employeeItems.length,
      disbursedAt: now,
      payroll,
    };
  }

  // -------------------------------------------------------------
  // 5. GET PAYROLL HISTORY
  // -------------------------------------------------------------
  async getPayrollHistory(): Promise<MonthlyPayroll[]> {
    return await this.payrollRepository.find({
      relations: { items: true },
      order: { monthYear: 'DESC', createdAt: 'DESC' },
    });
  }

  // -------------------------------------------------------------
  // 6. GET SINGLE PAYSLIP / VOUCHER
  // -------------------------------------------------------------
  async getPayslip(id: string): Promise<PayrollItem> {
    const item = await this.itemRepository.findOne({
      where: { id },
      relations: { monthlyPayroll: true, user: true },
    });
    if (!item) throw new NotFoundException(`Payroll item with ID ${id} not found`);
    return item;
  }

  // -------------------------------------------------------------
  // 7. GET MY PAYSLIPS (FOR LOGGED-IN USERS)
  // -------------------------------------------------------------
  async getMyPayslips(userId?: string, email?: string) {
    if (!userId && !email) {
      return {
        payslips: [],
        currentMonthEstimate: null,
      };
    }

    const qb = this.itemRepository
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.monthlyPayroll', 'monthlyPayroll')
      .leftJoinAndSelect('item.user', 'user')
      .orderBy('monthlyPayroll.monthYear', 'DESC')
      .addOrderBy('item.createdAt', 'DESC');

    if (userId && email) {
      qb.where(
        '(item.userId = :userId OR LOWER(item.recipientEmail) = LOWER(:email))',
        { userId, email: email.trim() },
      );
    } else if (userId) {
      qb.where('item.userId = :userId', { userId });
    } else if (email) {
      qb.where('LOWER(item.recipientEmail) = LOWER(:email)', {
        email: email.trim(),
      });
    }

    const items = await qb.getMany();

    // Check current month estimate
    let currentMonthEstimate: any = null;
    try {
      const summary = await this.getMonthlySummary();
      const currentItem = items.find(
        (it) => it.monthlyPayroll?.monthYear === summary.monthYear,
      );
      if (!currentItem) {
        const emp = summary.employees?.find(
          (e: any) =>
            (userId && e.userId === userId) ||
            (email && e.email?.toLowerCase() === email.toLowerCase().trim()),
        );
        if (emp) {
          currentMonthEstimate = {
            monthYear: summary.monthYear,
            monthName: summary.monthName,
            poolSharePercent: emp.poolSharePercent,
            estimatedAmount: emp.profitShareAmount,
            isPayrollDisbursed: summary.summary?.isPayrollDisbursed || false,
            totalEmployeePool: summary.summary?.totalEmployeePool || 0,
          };
        }
      }
    } catch (err) {
      // ignore estimate errors
    }

    return {
      payslips: items,
      currentMonthEstimate,
    };
  }
}

