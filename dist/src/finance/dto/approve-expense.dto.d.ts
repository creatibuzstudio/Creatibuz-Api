export declare class ApproveExpenseDto {
    role: 'ceo' | 'coo' | 'admin';
    userId?: string;
    userName?: string;
    approved: boolean;
    comment?: string;
}
