import { HttpStatus } from '@nestjs/common';
import { PackageBookingService } from './package-booking.service';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';
export declare class PackageBookingController {
    private readonly packageBookingService;
    constructor(packageBookingService: PackageBookingService);
    create(createPackageBookingDto: CreatePackageBookingDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package-booking.entity").PackageBooking;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package-booking.entity").PackageBooking[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package-booking.entity").PackageBooking;
    }>;
    update(id: string, updatePackageBookingDto: UpdatePackageBookingDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/package-booking.entity").PackageBooking;
    }>;
    sendReply(body: {
        bookingId?: string;
        to: string;
        subject: string;
        message: string;
        senderName?: string;
        newStatus?: string;
    }): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: {
            success: boolean;
            message: string;
            messageId: any;
        };
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: any;
    }>;
}
