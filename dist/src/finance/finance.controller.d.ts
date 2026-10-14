import { HttpStatus } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateCapitalDto } from './dto/create-capital.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApproveExpenseDto } from './dto/approve-expense.dto';
import { ExpenseStatus } from './entities/company-expense.entity';
export declare class FinanceController {
    private readonly financeService;
    constructor(financeService: FinanceService);
    getOverview(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
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
            settings: import("./entities/financial-setting.entity").FinancialSetting & {
                ceoUser?: any;
                cooUser?: any;
            };
        };
    }>;
    getSettings(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/financial-setting.entity").FinancialSetting & {
            ceoUser?: any;
            cooUser?: any;
        };
    }>;
    updateSettings(dto: UpdateSettingsDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/financial-setting.entity").FinancialSetting;
    }>;
    getExecutives(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            ceos: import("../users/entities/user.entity").User[];
            coos: import("../users/entities/user.entity").User[];
            allUsers: import("../users/entities/user.entity").User[];
        };
    }>;
    findAllCapitals(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investor-capital.entity").InvestorCapital[];
    }>;
    createCapital(dto: CreateCapitalDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/investor-capital.entity").InvestorCapital;
    }>;
    deleteCapital(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
    findAllExpenses(status?: ExpenseStatus): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/company-expense.entity").CompanyExpense[];
    }>;
    findOneExpense(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/company-expense.entity").CompanyExpense;
    }>;
    createExpense(dto: CreateExpenseDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/company-expense.entity").CompanyExpense;
    }>;
    approveExpense(id: string, dto: ApproveExpenseDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/company-expense.entity").CompanyExpense;
    }>;
    deleteExpense(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
