import { Repository } from 'typeorm';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';
import { PackageBooking } from './entities/package-booking.entity';
import { User } from '../users/entities/user.entity';
export declare class PackageBookingService {
    private readonly bookingRepository;
    private readonly userRepository;
    private transporter;
    constructor(bookingRepository: Repository<PackageBooking>, userRepository: Repository<User>);
    create(createPackageBookingDto: CreatePackageBookingDto): Promise<PackageBooking>;
    private sendEmailNotification;
    findAll(): Promise<PackageBooking[]>;
    findOne(id: string): Promise<PackageBooking>;
    update(id: string, updatePackageBookingDto: UpdatePackageBookingDto): Promise<PackageBooking>;
    remove(id: string): Promise<void>;
}
