import { Repository } from 'typeorm';
import { MonthlyPayroll, PayrollStatus } from './entities/monthly-payroll.entity';
import { PayrollItem, PayrollItemStatus } from './entities/payroll-item.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { DisbursePayrollDto } from './dto/disburse-payroll.dto';
import { WithdrawExecutiveDto } from './dto/withdraw-executive.dto';
export declare class PayrollService {
    private readonly payrollRepository;
    private readonly itemRepository;
    private readonly userRepository;
    private readonly orderRepository;
    private readonly settingRepository;
    constructor(payrollRepository: Repository<MonthlyPayroll>, itemRepository: Repository<PayrollItem>, userRepository: Repository<User>, orderRepository: Repository<Order>, settingRepository: Repository<FinancialSetting>);
    private getMonthName;
    getMonthlySummary(requestedMonth?: string): Promise<{
        monthYear: string;
        monthName: string;
        isSaved: boolean;
        payrollId: string;
        status: PayrollStatus;
        disbursedAt: Date;
        processedAt: Date;
        revenueBasis: {
            effectiveMonthlyRevenue: number;
            monthSpecificRevenue: number;
            allTimeRevenue: number;
            isUsingAllTimeFallback: boolean;
        };
        pools: {
            companyCost: {
                percent: number;
                amount: number;
            };
            employeePool: {
                percent: number;
                amount: number;
                totalEligibleCount: number;
                totalAllocatedPercent: number;
                unallocatedPercent: number;
                unallocatedAmount: number;
                totalDistributedToEmployees: number;
            };
            leadershipPool: {
                percent: number;
                amount: number;
            };
        };
        executives: {
            ceo: {
                user: User;
                percent: number;
                amount: number;
                isWithdrawn: boolean;
                item: PayrollItem;
                canWithdraw: boolean;
            };
            coo: {
                user: User;
                percent: number;
                amount: number;
                isWithdrawn: boolean;
                item: PayrollItem;
                canWithdraw: boolean;
            };
        };
        employees: {
            id: string;
            userId: string;
            name: string;
            email: string;
            phone: string;
            picture: string;
            role: UserRole;
            department: string;
            designation: string;
            poolSharePercent: number;
            baseSalary: number;
            profitShareAmount: number;
            bonus: number;
            deductions: number;
            netPayable: number;
            paymentStatus: PayrollItemStatus;
            paymentMethod: string;
            transactionReference: string;
            voucherNumber: string;
            paidAt: Date;
            notes: string;
        }[];
        summary: {
            totalAllocatedPercent: number;
            unallocatedPercent: number;
            unallocatedAmount: number;
            totalEmployeePool: number;
            totalDistributedToEmployees: number;
            totalEmployeePayrollGross: number;
            isPayrollDisbursed: boolean;
        };
    }>;
    generateOrUpdatePayroll(dto: GeneratePayrollDto): Promise<MonthlyPayroll>;
    withdrawExecutiveShare(dto: WithdrawExecutiveDto): Promise<{
        message: string;
        monthYear: string;
        role: "ceo" | "coo";
        amountWithdrawn: number;
        voucherNumber: string;
        transactionReference: string;
        paymentMethod: string;
        paidAt: Date;
        item: PayrollItem;
    }>;
    disburseEmployeePayroll(dto: DisbursePayrollDto): Promise<{
        message: string;
        monthYear: string;
        totalEmployeesPaid: number;
        disbursedAt: Date;
        payroll: MonthlyPayroll;
    }>;
    getPayrollHistory(): Promise<MonthlyPayroll[]>;
    getPayslip(id: string): Promise<PayrollItem>;
}
