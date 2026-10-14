export declare enum ExpenseStatus {
    PENDING = "pending",
    CEO_APPROVED = "ceo_approved",
    COO_APPROVED = "coo_approved",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare class CompanyExpense {
    id: string;
    voucherNumber: string;
    title: string;
    category: string;
    amount: number;
    expenseDate: Date;
    vendor: string;
    receiptUrl: string;
    notes: string;
    requestedByName: string;
    requestedByUserId: string;
    status: ExpenseStatus;
    ceoApproval?: {
        approved: boolean;
        date?: string;
        userId?: string;
        userName?: string;
        comment?: string;
    };
    cooApproval?: {
        approved: boolean;
        date?: string;
        userId?: string;
        userName?: string;
        comment?: string;
    };
    disbursedFrom: string;
    isDisbursed: boolean;
    disbursedDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
