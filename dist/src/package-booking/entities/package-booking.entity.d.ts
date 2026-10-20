import { Package } from '../../package/entities/package.entity';
export declare class PackageBooking {
    id: string;
    name: string;
    userEmail: string;
    companyName: string;
    companyEmail: string;
    billingCycle: string;
    packageId: string;
    package?: Package;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
