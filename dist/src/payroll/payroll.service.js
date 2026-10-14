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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const monthly_payroll_entity_1 = require("./entities/monthly-payroll.entity");
const payroll_item_entity_1 = require("./entities/payroll-item.entity");
const user_entity_1 = require("../users/entities/user.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const financial_setting_entity_1 = require("../finance/entities/financial-setting.entity");
let PayrollService = class PayrollService {
    constructor(payrollRepository, itemRepository, userRepository, orderRepository, settingRepository) {
        this.payrollRepository = payrollRepository;
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
        this.settingRepository = settingRepository;
    }
    getMonthName(monthYear) {
        const [year, month] = monthYear.split('-').map(Number);
        const date = new Date(year, month - 1, 1);
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }
    async getMonthlySummary(requestedMonth) {
        const now = new Date();
        const currentMonthYear = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const monthYear = requestedMonth || currentMonthYear;
        const monthName = this.getMonthName(monthYear);
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
        let ceoEffectivePercent = settings.ceoPercent !== undefined && settings.ceoPercent !== null
            ? Number(settings.ceoPercent)
            : null;
        let cooEffectivePercent = settings.cooPercent !== undefined && settings.cooPercent !== null
            ? Number(settings.cooPercent)
            : null;
        if (ceoEffectivePercent === null || cooEffectivePercent === null) {
            const cRatio = Number(settings.ceoShareRatio || 60);
            const oRatio = Number(settings.cooShareRatio || 40);
            ceoEffectivePercent = (leadershipPoolPercent * cRatio) / 100;
            cooEffectivePercent = (leadershipPoolPercent * oRatio) / 100;
        }
        else {
            leadershipPoolPercent = Number((ceoEffectivePercent + cooEffectivePercent).toFixed(2));
        }
        const allOrders = await this.orderRepository.find();
        let monthSpecificRevenue = 0;
        let allTimeRevenue = 0;
        allOrders.forEach((o) => {
            const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
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
            }
            else if (hasPaymentInMonth) {
                monthSpecificRevenue += monthPaymentAmount;
            }
        });
        const effectiveMonthlyRevenue = monthSpecificRevenue > 0 ? monthSpecificRevenue : allTimeRevenue;
        const employeePoolAllocated = Number(((effectiveMonthlyRevenue * employeePoolPercent) / 100).toFixed(2));
        const ceoShareAmount = Number(((effectiveMonthlyRevenue * ceoEffectivePercent) / 100).toFixed(2));
        const cooShareAmount = Number(((effectiveMonthlyRevenue * cooEffectivePercent) / 100).toFixed(2));
        const companyCostAllocated = Number(((effectiveMonthlyRevenue * companyCostPercent) / 100).toFixed(2));
        const allUsers = await this.userRepository.find({
            relations: { department: true, designation: true },
            order: { order: 'ASC', name: 'ASC' },
        });
        const ceoUser = allUsers.find((u) => u.role?.toLowerCase() === 'ceo' || u.role === user_entity_1.UserRole.CEO) || null;
        const cooUser = allUsers.find((u) => u.role?.toLowerCase() === 'coo' || u.role === user_entity_1.UserRole.COO) || null;
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
        const unallocatedAmount = Number(((employeePoolAllocated * unallocatedPercent) / 100).toFixed(2));
        const existingPayroll = await this.payrollRepository.findOne({
            where: { monthYear },
            relations: { items: true },
        });
        const savedItems = existingPayroll?.items || [];
        const ceoItem = savedItems.find((i) => i.type === payroll_item_entity_1.PayrollRecipientType.CEO);
        const cooItem = savedItems.find((i) => i.type === payroll_item_entity_1.PayrollRecipientType.COO);
        const isCeoWithdrawn = ceoItem?.paymentStatus === payroll_item_entity_1.PayrollItemStatus.WITHDRAWN ||
            ceoItem?.paymentStatus === payroll_item_entity_1.PayrollItemStatus.PAID;
        const isCooWithdrawn = cooItem?.paymentStatus === payroll_item_entity_1.PayrollItemStatus.WITHDRAWN ||
            cooItem?.paymentStatus === payroll_item_entity_1.PayrollItemStatus.PAID;
        const isPayrollDisbursed = existingPayroll?.status === monthly_payroll_entity_1.PayrollStatus.PAID;
        let totalDistributedToEmployees = 0;
        const employeeItemsList = eligibleEmployees.map((emp) => {
            const saved = savedItems.find((i) => i.userId === emp.id || i.recipientEmail === emp.email);
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
                paymentStatus: saved?.paymentStatus || payroll_item_entity_1.PayrollItemStatus.PENDING,
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
            status: existingPayroll?.status || monthly_payroll_entity_1.PayrollStatus.DRAFT,
            disbursedAt: existingPayroll?.disbursedAt || null,
            processedAt: existingPayroll?.processedAt || null,
            revenueBasis: {
                effectiveMonthlyRevenue,
                monthSpecificRevenue,
                allTimeRevenue,
                isUsingAllTimeFallback: monthSpecificRevenue === 0 && allTimeRevenue > 0,
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
    async generateOrUpdatePayroll(dto) {
        const summary = await this.getMonthlySummary(dto.monthYear);
        let payroll = await this.payrollRepository.findOne({
            where: { monthYear: dto.monthYear },
            relations: { items: true },
        });
        if (payroll && payroll.status === monthly_payroll_entity_1.PayrollStatus.PAID) {
            throw new common_1.BadRequestException(`Payroll for ${summary.monthName} has already been paid and finalized.`);
        }
        if (!payroll) {
            payroll = this.payrollRepository.create({
                monthYear: dto.monthYear,
                monthName: summary.monthName,
                status: monthly_payroll_entity_1.PayrollStatus.DRAFT,
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
        if (dto.notes)
            payroll.notes = dto.notes;
        payroll = await this.payrollRepository.save(payroll);
        const existingItems = payroll.items || [];
        const itemMap = new Map();
        existingItems.forEach((it) => {
            if (it.userId)
                itemMap.set(it.userId, it);
            if (it.type === payroll_item_entity_1.PayrollRecipientType.CEO)
                itemMap.set('role-ceo', it);
            if (it.type === payroll_item_entity_1.PayrollRecipientType.COO)
                itemMap.set('role-coo', it);
        });
        const itemsToSave = [];
        summary.employees.forEach((emp, index) => {
            let item = itemMap.get(emp.userId);
            const custom = dto.customItems?.find((c) => c.userId === emp.userId);
            const bonus = custom?.bonus !== undefined ? Number(custom.bonus) : emp.bonus;
            const deductions = custom?.deductions !== undefined
                ? Number(custom.deductions)
                : emp.deductions;
            const profitShare = emp.profitShareAmount;
            const netPayable = Number((profitShare + bonus - deductions).toFixed(2));
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
                    type: payroll_item_entity_1.PayrollRecipientType.EMPLOYEE,
                    paymentStatus: payroll_item_entity_1.PayrollItemStatus.PENDING,
                    voucherNumber: `PAY-${dto.monthYear.replace('-', '')}-${String(index + 1001).slice(-4)}`,
                });
            }
            item.baseSalary = emp.poolSharePercent;
            item.profitSharePercent = emp.poolSharePercent;
            item.profitShareAmount = profitShare;
            item.bonus = bonus;
            item.deductions = deductions;
            item.netPayable = netPayable;
            if (custom?.notes)
                item.notes = custom.notes;
            itemsToSave.push(item);
        });
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
                    type: payroll_item_entity_1.PayrollRecipientType.CEO,
                    paymentStatus: payroll_item_entity_1.PayrollItemStatus.PENDING,
                    voucherNumber: `DIV-CEO-${dto.monthYear.replace('-', '')}`,
                });
            }
            ceoItem.profitSharePercent = summary.executives.ceo.percent;
            ceoItem.profitShareAmount = summary.executives.ceo.amount;
            ceoItem.netPayable = summary.executives.ceo.amount;
            itemsToSave.push(ceoItem);
        }
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
                    type: payroll_item_entity_1.PayrollRecipientType.COO,
                    paymentStatus: payroll_item_entity_1.PayrollItemStatus.PENDING,
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
        }));
    }
    async withdrawExecutiveShare(dto) {
        const roleKey = dto.role?.toLowerCase();
        if (roleKey !== 'ceo' && roleKey !== 'coo') {
            throw new common_1.BadRequestException('Role must be either ceo or coo');
        }
        let payroll = await this.payrollRepository.findOne({
            where: { monthYear: dto.monthYear },
            relations: { items: true },
        });
        if (!payroll) {
            payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
        }
        const recipientType = roleKey === 'ceo' ? payroll_item_entity_1.PayrollRecipientType.CEO : payroll_item_entity_1.PayrollRecipientType.COO;
        let item = payroll.items?.find((i) => i.type === recipientType);
        if (!item) {
            payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
            item = payroll.items?.find((i) => i.type === recipientType);
        }
        if (!item) {
            throw new common_1.NotFoundException(`Executive record for ${roleKey.toUpperCase()} not found for ${dto.monthYear}. Please check executive assignment.`);
        }
        if (item.paymentStatus === payroll_item_entity_1.PayrollItemStatus.WITHDRAWN ||
            item.paymentStatus === payroll_item_entity_1.PayrollItemStatus.PAID) {
            throw new common_1.BadRequestException(`${roleKey.toUpperCase()} has already withdrawn their share for ${dto.monthYear} on ${new Date(item.paidAt).toLocaleDateString()}. Withdrawals are restricted to once per calendar month.`);
        }
        item.paymentStatus = payroll_item_entity_1.PayrollItemStatus.WITHDRAWN;
        item.paymentMethod = dto.paymentMethod || 'bank_transfer';
        item.transactionReference =
            dto.transactionReference ||
                `TRX-WD-${Date.now().toString().slice(-8)}`;
        item.voucherNumber =
            item.voucherNumber ||
                `DIV-${roleKey.toUpperCase()}-${dto.monthYear.replace('-', '')}`;
        item.paidAt = new Date();
        if (dto.notes)
            item.notes = dto.notes;
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
    async disburseEmployeePayroll(dto) {
        let payroll = await this.payrollRepository.findOne({
            where: { monthYear: dto.monthYear },
            relations: { items: true },
        });
        if (!payroll) {
            payroll = await this.generateOrUpdatePayroll({ monthYear: dto.monthYear });
        }
        const employeeItems = payroll.items?.filter((i) => i.type === payroll_item_entity_1.PayrollRecipientType.EMPLOYEE) || [];
        if (employeeItems.length === 0) {
            throw new common_1.BadRequestException('No employee payroll records found to disburse.');
        }
        const now = new Date();
        employeeItems.forEach((item, index) => {
            item.paymentStatus = payroll_item_entity_1.PayrollItemStatus.PAID;
            item.paymentMethod = dto.paymentMethod || item.paymentMethod || 'bank_transfer';
            if (dto.transactionReference) {
                item.transactionReference = `${dto.transactionReference}-${index + 1}`;
            }
            item.paidAt = now;
            if (!item.voucherNumber) {
                item.voucherNumber = `PAY-${dto.monthYear.replace('-', '')}-${String(index + 1001).slice(-4)}`;
            }
        });
        await this.itemRepository.save(employeeItems);
        payroll.status = monthly_payroll_entity_1.PayrollStatus.PAID;
        payroll.disbursedAt = now;
        payroll.totalEmployeesPaid = employeeItems.length;
        if (dto.notes)
            payroll.notes = dto.notes;
        if (dto.processedBy)
            payroll.processedBy = dto.processedBy;
        await this.payrollRepository.save(payroll);
        return {
            message: `Employee payroll for ${payroll.monthName} successfully disbursed to ${employeeItems.length} employees.`,
            monthYear: dto.monthYear,
            totalEmployeesPaid: employeeItems.length,
            disbursedAt: now,
            payroll,
        };
    }
    async getPayrollHistory() {
        return await this.payrollRepository.find({
            relations: { items: true },
            order: { monthYear: 'DESC', createdAt: 'DESC' },
        });
    }
    async getPayslip(id) {
        const item = await this.itemRepository.findOne({
            where: { id },
            relations: { monthlyPayroll: true, user: true },
        });
        if (!item)
            throw new common_1.NotFoundException(`Payroll item with ID ${id} not found`);
        return item;
    }
    async getMyPayslips(userId, email) {
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
            qb.where('(item.userId = :userId OR LOWER(item.recipientEmail) = LOWER(:email))', { userId, email: email.trim() });
        }
        else if (userId) {
            qb.where('item.userId = :userId', { userId });
        }
        else if (email) {
            qb.where('LOWER(item.recipientEmail) = LOWER(:email)', {
                email: email.trim(),
            });
        }
        const items = await qb.getMany();
        let currentMonthEstimate = null;
        try {
            const summary = await this.getMonthlySummary();
            const currentItem = items.find((it) => it.monthlyPayroll?.monthYear === summary.monthYear);
            if (!currentItem) {
                const emp = summary.employees?.find((e) => (userId && e.userId === userId) ||
                    (email && e.email?.toLowerCase() === email.toLowerCase().trim()));
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
        }
        catch (err) {
        }
        return {
            payslips: items,
            currentMonthEstimate,
        };
    }
};
exports.PayrollService = PayrollService;
exports.PayrollService = PayrollService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(monthly_payroll_entity_1.MonthlyPayroll)),
    __param(1, (0, typeorm_1.InjectRepository)(payroll_item_entity_1.PayrollItem)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(financial_setting_entity_1.FinancialSetting)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PayrollService);
//# sourceMappingURL=payroll.service.js.map