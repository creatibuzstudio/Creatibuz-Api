import { Repository } from 'typeorm';
import { InvestorCapital } from './entities/investor-capital.entity';
import { FinancialSetting } from './entities/financial-setting.entity';
import { CompanyExpense, ExpenseStatus } from './entities/company-expense.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { CreateCapitalDto } from './dto/create-capital.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApproveExpenseDto } from './dto/approve-expense.dto';
export declare class FinanceService {
    private readonly capitalRepository;
    private readonly settingRepository;
    private readonly expenseRepository;
    private readonly userRepository;
    private readonly orderRepository;
    constructor(capitalRepository: Repository<InvestorCapital>, settingRepository: Repository<FinancialSetting>, expenseRepository: Repository<CompanyExpense>, userRepository: Repository<User>, orderRepository: Repository<Order>);
    getSettings(): Promise<FinancialSetting & {
        ceoUser?: any;
        cooUser?: any;
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<FinancialSetting>;
    createCapital(dto: CreateCapitalDto): Promise<InvestorCapital>;
    findAllCapitals(): Promise<InvestorCapital[]>;
    deleteCapital(id: string): Promise<void>;
    createExpense(dto: CreateExpenseDto): Promise<CompanyExpense>;
    findAllExpenses(status?: ExpenseStatus): Promise<CompanyExpense[]>;
    findOneExpense(id: string): Promise<CompanyExpense>;
    approveExpense(id: string, dto: ApproveExpenseDto): Promise<CompanyExpense>;
    deleteExpense(id: string): Promise<void>;
    getExecutiveUsers(): Promise<{
        ceos: User[];
        coos: User[];
        allUsers: User[];
    }>;
    getOverview(): Promise<{
        summary: {
            totalInvestorCapital: number;
            totalOrderRevenue: number;
            totalOrderInvoiced: number;
            totalApprovedExpenses: number;
            totalPendingExpenses: number;
            pendingExpenseCount: number;
            totalTreasuryBalance: number;
        };
        pools: {
            companyCost: {
                percent: number;
                allocated: number;
                spent: number;
                netBalance: number;
            };
            employeePool: {
                percent: number;
                allocated: number;
            };
            leadershipPool: {
                percent: number;
                allocated: number;
                ceoPercent: number;
                cooPercent: number;
                ceoShareRatio: number;
                cooShareRatio: number;
                ceoShareAmount: number;
                cooShareAmount: number;
                ceoEffectivePercent: number;
                cooEffectivePercent: number;
            };
        };
        executives: {
            ceo: {
                user: any;
                percent: number;
                shareRatioOfLeadership: number;
                effectivePercentOfTotalRevenue: number;
                totalEarnings: number;
            };
            coo: {
                user: any;
                percent: number;
                shareRatioOfLeadership: number;
                effectivePercentOfTotalRevenue: number;
                totalEarnings: number;
            };
        };
        executivesList: {
            key: string;
            roleKey: string;
            roleTitle: string;
            user: any;
            shareRatioOfLeadership: number;
            effectivePercentOfTotalRevenue: number;
            totalEarnings: number;
        }[];
        settings: FinancialSetting & {
            ceoUser?: any;
            cooUser?: any;
        };
    }>;
}
