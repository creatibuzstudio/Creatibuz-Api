import { User } from '../../users/entities/user.entity';
export declare class InvestorCapital {
    id: string;
    user: User;
    userId: string;
    invoiceNumber: string;
    investorName: string;
    investorEmail: string;
    investorPhone: string;
    amount: number;
    investmentDate: Date;
    equityPercentage: number;
    paymentMethod: string;
    reference: string;
    documentUrl: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
}
