export declare class WithdrawExecutiveDto {
    monthYear: string;
    role: 'ceo' | 'coo';
    userId?: string;
    paymentMethod?: string;
    transactionReference?: string;
    notes?: string;
}
