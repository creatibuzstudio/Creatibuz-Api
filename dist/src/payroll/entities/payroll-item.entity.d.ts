import { MonthlyPayroll } from './monthly-payroll.entity';
import { User } from '../../users/entities/user.entity';
export declare enum PayrollRecipientType {
    EMPLOYEE = "employee",
    CEO = "ceo",
    COO = "coo"
}
export declare enum PayrollItemStatus {
    PENDING = "pending",
    PAID = "paid",
    WITHDRAWN = "withdrawn"
}
export declare class PayrollItem {
    id: string;
    monthlyPayroll: MonthlyPayroll;
    monthlyPayrollId: string;
    user: User;
    userId: string;
    recipientName: string;
    recipientEmail: string;
    recipientRole: string;
    department: string;
    designation: string;
    type: PayrollRecipientType;
    baseSalary: number;
    profitSharePercent: number;
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
    createdAt: Date;
    updatedAt: Date;
}
