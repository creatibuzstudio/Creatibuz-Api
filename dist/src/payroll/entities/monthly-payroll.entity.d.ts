import { PayrollItem } from './payroll-item.entity';
export declare enum PayrollStatus {
    DRAFT = "draft",
    APPROVED = "approved",
    PAID = "paid"
}
export declare class MonthlyPayroll {
    id: string;
    monthYear: string;
    monthName: string;
    status: PayrollStatus;
    totalOrderRevenue: number;
    companyCostPercent: number;
    companyCostAmount: number;
    employeePoolPercent: number;
    employeePoolAmount: number;
    leadershipPoolPercent: number;
    leadershipPoolAmount: number;
    ceoPercent: number;
    ceoAmount: number;
    cooPercent: number;
    cooAmount: number;
    totalBaseSalary: number;
    totalProfitShare: number;
    totalEmployeesPaid: number;
    processedAt: Date;
    disbursedAt: Date;
    processedBy: string;
    notes: string;
    items: PayrollItem[];
    createdAt: Date;
    updatedAt: Date;
}
