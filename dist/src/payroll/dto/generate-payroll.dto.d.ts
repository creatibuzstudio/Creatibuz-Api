export declare class CustomItemDto {
    userId: string;
    bonus?: number;
    deductions?: number;
    notes?: string;
}
export declare class GeneratePayrollDto {
    monthYear: string;
    monthName?: string;
    distributionMethod?: 'equal' | 'proportional';
    processedBy?: string;
    notes?: string;
    customItems?: CustomItemDto[];
}
