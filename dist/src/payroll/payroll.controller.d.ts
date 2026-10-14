import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { DisbursePayrollDto } from './dto/disburse-payroll.dto';
import { WithdrawExecutiveDto } from './dto/withdraw-executive.dto';
export declare class PayrollController {
    private readonly payrollService;
    constructor(payrollService: PayrollService);
    getMonthlySummary(month?: string): Promise<{
        monthYear: string;
        monthName: string;
        isSaved: boolean;
        payrollId: string;
        status: import("./entities/monthly-payroll.entity").PayrollStatus;
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
                user: import("../users/entities/user.entity").User;
                percent: number;
                amount: number;
                isWithdrawn: boolean;
                item: import("./entities/payroll-item.entity").PayrollItem;
                canWithdraw: boolean;
            };
            coo: {
                user: import("../users/entities/user.entity").User;
                percent: number;
                amount: number;
                isWithdrawn: boolean;
                item: import("./entities/payroll-item.entity").PayrollItem;
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
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            poolSharePercent: number;
            baseSalary: number;
            profitShareAmount: number;
            bonus: number;
            deductions: number;
            netPayable: number;
            paymentStatus: import("./entities/payroll-item.entity").PayrollItemStatus;
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
    generateOrUpdatePayroll(dto: GeneratePayrollDto): Promise<import("./entities/monthly-payroll.entity").MonthlyPayroll>;
    withdrawExecutive(dto: WithdrawExecutiveDto): Promise<{
        message: string;
        monthYear: string;
        role: "ceo" | "coo";
        amountWithdrawn: number;
        voucherNumber: string;
        transactionReference: string;
        paymentMethod: string;
        paidAt: Date;
        item: import("./entities/payroll-item.entity").PayrollItem;
    }>;
    disbursePayroll(dto: DisbursePayrollDto): Promise<{
        message: string;
        monthYear: string;
        totalEmployeesPaid: number;
        disbursedAt: Date;
        payroll: import("./entities/monthly-payroll.entity").MonthlyPayroll;
    }>;
    getPayrollHistory(): Promise<import("./entities/monthly-payroll.entity").MonthlyPayroll[]>;
    getPayslip(id: string): Promise<import("./entities/payroll-item.entity").PayrollItem>;
}
