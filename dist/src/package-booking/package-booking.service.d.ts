import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';
import { PackageBooking } from './entities/package-booking.entity';
import { User } from '../users/entities/user.entity';
export declare class PackageBookingService implements OnModuleInit {
    private readonly bookingRepository;
    private readonly userRepository;
    private readonly logger;
    private isColumnChecked;
    private transporter;
    constructor(bookingRepository: Repository<PackageBooking>, userRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    private ensureColumnExists;
    create(createPackageBookingDto: CreatePackageBookingDto): Promise<PackageBooking>;
    private sendEmailNotification;
    findAll(): Promise<PackageBooking[]>;
    findOne(id: string): Promise<PackageBooking>;
    update(id: string, updatePackageBookingDto: UpdatePackageBookingDto): Promise<PackageBooking>;
    private sendStatusUpdateEmail;
    sendReplyEmail(dto: {
        bookingId?: string;
        to: string;
        subject: string;
        message: string;
        senderName?: string;
        newStatus?: string;
    }): Promise<{
        success: boolean;
        message: string;
        messageId: any;
    }>;
    remove(id: string): Promise<void>;
}
