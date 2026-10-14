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
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const investor_capital_entity_1 = require("./entities/investor-capital.entity");
const financial_setting_entity_1 = require("./entities/financial-setting.entity");
const company_expense_entity_1 = require("./entities/company-expense.entity");
const user_entity_1 = require("../users/entities/user.entity");
const order_entity_1 = require("../orders/entities/order.entity");
let FinanceService = class FinanceService {
    constructor(capitalRepository, settingRepository, expenseRepository, userRepository, orderRepository) {
        this.capitalRepository = capitalRepository;
        this.settingRepository = settingRepository;
        this.expenseRepository = expenseRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }
    async getSettings() {
        const settings = await this.settingRepository.find({
            order: { createdAt: 'ASC' },
            take: 1,
        });
        let setting = settings[0] || null;
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
        let ceoUser = null;
        let cooUser = null;
        if (setting.ceoUserId) {
            ceoUser = await this.userRepository.findOne({
                where: { id: setting.ceoUserId },
                relations: { designation: true, department: true },
            });
            if (ceoUser && ceoUser.role?.toLowerCase() !== 'ceo' && ceoUser.role !== user_entity_1.UserRole.CEO) {
                ceoUser = null;
            }
        }
        if (!ceoUser) {
            const allUsers = await this.userRepository.find({
                relations: { designation: true, department: true },
                order: { createdAt: 'ASC' },
            });
            ceoUser =
                allUsers.find((u) => u.role?.toLowerCase() === 'ceo' || u.role === user_entity_1.UserRole.CEO) ||
                    null;
            if (ceoUser) {
                setting.ceoUserId = ceoUser.id;
                await this.settingRepository.save(setting);
            }
        }
        if (setting.cooUserId) {
            cooUser = await this.userRepository.findOne({
                where: { id: setting.cooUserId },
                relations: { designation: true, department: true },
            });
            if (cooUser && cooUser.role?.toLowerCase() !== 'coo' && cooUser.role !== user_entity_1.UserRole.COO) {
                cooUser = null;
            }
        }
        if (!cooUser) {
            const allUsers = await this.userRepository.find({
                relations: { designation: true, department: true },
                order: { createdAt: 'ASC' },
            });
            cooUser =
                allUsers.find((u) => u.role?.toLowerCase() === 'coo' || u.role === user_entity_1.UserRole.COO) ||
                    null;
            if (cooUser) {
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
    async updateSettings(dto) {
        const settings = await this.settingRepository.find({
            order: { createdAt: 'ASC' },
            take: 1,
        });
        let setting = settings[0] || null;
        if (!setting) {
            setting = this.settingRepository.create(dto);
        }
        else {
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
                setting.ceoShareRatio = Number(((Number(dto.ceoPercent) / setting.leadershipPoolPercent) * 100).toFixed(2));
                setting.cooShareRatio = Number(((Number(dto.cooPercent) / setting.leadershipPoolPercent) * 100).toFixed(2));
            }
        }
        else if (dto.leadershipPoolPercent !== undefined &&
            dto.ceoShareRatio !== undefined &&
            dto.cooShareRatio !== undefined) {
            setting.leadershipPoolPercent = Number(dto.leadershipPoolPercent);
            setting.ceoShareRatio = Number(dto.ceoShareRatio);
            setting.cooShareRatio = Number(dto.cooShareRatio);
            setting.ceoPercent = Number(((Number(dto.leadershipPoolPercent) * Number(dto.ceoShareRatio)) / 100).toFixed(2));
            setting.cooPercent = Number(((Number(dto.leadershipPoolPercent) * Number(dto.cooShareRatio)) / 100).toFixed(2));
        }
        else if (dto.leadershipPoolPercent !== undefined) {
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
    async createCapital(dto) {
        const count = await this.capitalRepository.count();
        const invoiceNumber = dto.invoiceNumber ||
            `INV-CAP-${new Date().getFullYear()}-${String(count + 1001).slice(-4)}`;
        let user = null;
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
    async findAllCapitals() {
        return await this.capitalRepository.find({
            relations: { user: true },
            order: { investmentDate: 'DESC', createdAt: 'DESC' },
        });
    }
    async deleteCapital(id) {
        const item = await this.capitalRepository.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException(`Investor capital with ID ${id} not found`);
        await this.capitalRepository.remove(item);
    }
    async createExpense(dto) {
        const count = await this.expenseRepository.count();
        const voucherNumber = dto.voucherNumber ||
            `EXP-${new Date().getFullYear()}-${String(count + 1001).slice(-4)}`;
        const item = this.expenseRepository.create({
            ...dto,
            voucherNumber,
            status: company_expense_entity_1.ExpenseStatus.PENDING,
        });
        return await this.expenseRepository.save(item);
    }
    async findAllExpenses(status) {
        const where = {};
        if (status) {
            where.status = status;
        }
        return await this.expenseRepository.find({
            where,
            order: { expenseDate: 'DESC', createdAt: 'DESC' },
        });
    }
    async findOneExpense(id) {
        const item = await this.expenseRepository.findOne({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException(`Expense with ID ${id} not found`);
        return item;
    }
    async approveExpense(id, dto) {
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
        }
        else if (dto.role === 'coo') {
            expense.cooApproval = approvalRecord;
        }
        else if (dto.role === 'admin') {
            expense.ceoApproval = approvalRecord;
            expense.cooApproval = approvalRecord;
        }
        if ((expense.ceoApproval && !expense.ceoApproval.approved) ||
            (expense.cooApproval && !expense.cooApproval.approved)) {
            expense.status = company_expense_entity_1.ExpenseStatus.REJECTED;
            expense.isDisbursed = false;
        }
        else if (expense.ceoApproval?.approved &&
            expense.cooApproval?.approved) {
            expense.status = company_expense_entity_1.ExpenseStatus.APPROVED;
            expense.isDisbursed = true;
            expense.disbursedDate = new Date();
        }
        else if (expense.ceoApproval?.approved) {
            expense.status = company_expense_entity_1.ExpenseStatus.CEO_APPROVED;
        }
        else if (expense.cooApproval?.approved) {
            expense.status = company_expense_entity_1.ExpenseStatus.COO_APPROVED;
        }
        return await this.expenseRepository.save(expense);
    }
    async deleteExpense(id) {
        const item = await this.findOneExpense(id);
        await this.expenseRepository.remove(item);
    }
    async getExecutiveUsers() {
        const users = await this.userRepository.find({
            relations: { designation: true, department: true },
            order: { name: 'ASC' },
        });
        const ceos = users.filter((u) => u.role?.toLowerCase() === 'ceo' || u.role === user_entity_1.UserRole.CEO);
        const coos = users.filter((u) => u.role?.toLowerCase() === 'coo' || u.role === user_entity_1.UserRole.COO);
        return { ceos, coos, allUsers: users };
    }
    async getOverview() {
        const settings = await this.getSettings();
        const orders = await this.orderRepository.find();
        let totalOrderRevenue = 0;
        let totalOrderInvoiced = 0;
        orders.forEach((o) => {
            const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
            const disc = Number(o.discount || 0);
            const tx = Number(o.tax || 0);
            const orderInvoiced = Math.max(0, sub - disc + tx) || Number(o.budget || 0);
            const adv = Number(o.advance || 0);
            const pmtSum = Array.isArray(o.payments)
                ? o.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                : 0;
            const pStatus = String(o.paymentStatus || '').toLowerCase();
            const orderPaid = pStatus === 'paid'
                ? Math.max(orderInvoiced, adv, pmtSum)
                : Math.max(adv, pmtSum);
            totalOrderRevenue += orderPaid;
            totalOrderInvoiced += orderInvoiced;
        });
        const capitals = await this.capitalRepository.find();
        let totalInvestorCapital = 0;
        capitals.forEach((c) => {
            totalInvestorCapital += Number(c.amount || 0);
        });
        const expenses = await this.expenseRepository.find();
        let totalApprovedExpenses = 0;
        let totalPendingExpenses = 0;
        let pendingCount = 0;
        expenses.forEach((e) => {
            const amt = Number(e.amount || 0);
            if (e.status === company_expense_entity_1.ExpenseStatus.APPROVED) {
                totalApprovedExpenses += amt;
            }
            else if (e.status === company_expense_entity_1.ExpenseStatus.PENDING ||
                e.status === company_expense_entity_1.ExpenseStatus.CEO_APPROVED ||
                e.status === company_expense_entity_1.ExpenseStatus.COO_APPROVED) {
                totalPendingExpenses += amt;
                pendingCount += 1;
            }
        });
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
        const ceoShareRatio = leadershipPoolPercent > 0
            ? Number(((ceoEffectivePercent / leadershipPoolPercent) * 100).toFixed(2))
            : 60;
        const cooShareRatio = leadershipPoolPercent > 0
            ? Number(((cooEffectivePercent / leadershipPoolPercent) * 100).toFixed(2))
            : 40;
        const companyCostAllocated = totalOrderRevenue * (companyCostPercent / 100);
        const companyCostNetBalance = Math.max(0, companyCostAllocated - totalApprovedExpenses);
        const employeePoolAllocated = totalOrderRevenue * (employeePoolPercent / 100);
        const leadershipPoolAllocated = totalOrderRevenue * (leadershipPoolPercent / 100);
        const ceoShareAmount = totalOrderRevenue * (ceoEffectivePercent / 100);
        const cooShareAmount = totalOrderRevenue * (cooEffectivePercent / 100);
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
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(investor_capital_entity_1.InvestorCapital)),
    __param(1, (0, typeorm_1.InjectRepository)(financial_setting_entity_1.FinancialSetting)),
    __param(2, (0, typeorm_1.InjectRepository)(company_expense_entity_1.CompanyExpense)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], FinanceService);
//# sourceMappingURL=finance.service.js.map