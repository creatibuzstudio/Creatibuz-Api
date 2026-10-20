import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';
import { PackageBooking } from './entities/package-booking.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PackageBookingService {
  private transporter;

  constructor(
    @InjectRepository(PackageBooking)
    private readonly bookingRepository: Repository<PackageBooking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    const port = Number(process.env.MAIL_PORT) || 465;
    const isSecure = process.env.MAIL_SECURE ? process.env.MAIL_SECURE === 'true' : port === 465;

    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.hostinger.com',
      port: port,
      secure: isSecure,
      auth: {
        user: process.env.MAIL_USER || 'info@creatibuz.com',
        pass: process.env.MAIL_PASS || 'Hakim@creatibuz26',
      },
    });
  }

  async create(createPackageBookingDto: CreatePackageBookingDto): Promise<PackageBooking> {
    const booking = this.bookingRepository.create(createPackageBookingDto);
    const savedBooking = await this.bookingRepository.save(booking);

    // Automatically create a client user
    let generatedPassword = '';
    const existingUser = await this.userRepository.findOne({ where: { email: savedBooking.userEmail } });
    if (!existingUser) {
      generatedPassword = Math.random().toString(36).slice(-8); // Generate 8 char password
      const hashedPassword = await bcrypt.hash(generatedPassword, 10);
      
      const newUser = this.userRepository.create({
        name: savedBooking.name,
        email: savedBooking.userEmail,
        password: hashedPassword,
        role: UserRole.CLIENT,
      });
      await this.userRepository.save(newUser);
    }

    this.sendEmailNotification(savedBooking, generatedPassword).catch((err) => {
      console.error('Failed to send package booking email notification:', err);
    });

    return savedBooking;
  }

  private async sendEmailNotification(booking: PackageBooking, generatedPassword?: string) {
    const superAdminEmail = process.env.SUPERADMIN_EMAIL || process.env.MAIL_USER || 'info@creatibuz.com';
    const fromAddress = process.env.MAIL_FROM || `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;
    
    const mailOptions = {
      from: fromAddress,
      to: superAdminEmail,
      subject: `New Package Booking Request from ${booking.name}`,
      html: `
        <h2>New Package Booking Request</h2>
        <p>A new booking request has been submitted by <strong>${booking.name}</strong>.</p>
        <table border="1" cellpadding="10" style="border-collapse: collapse;">
          <tr>
            <th>User Name</th>
            <td>${booking.name}</td>
          </tr>
          <tr>
            <th>User Email</th>
            <td>${booking.userEmail}</td>
          </tr>
          <tr>
            <th>Company Name</th>
            <td>${booking.companyName}</td>
          </tr>
          <tr>
            <th>Company Email</th>
            <td>${booking.companyEmail}</td>
          </tr>
          <tr>
            <th>Package ID</th>
            <td>${booking.packageId}</td>
          </tr>
          <tr>
            <th>Billing Cycle</th>
            <td>${booking.billingCycle}</td>
          </tr>
        </table>
        
        ${generatedPassword ? `
        <br />
        <div style="padding: 15px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h3 style="margin-top: 0; color: #0f172a;">New Client Account Created</h3>
          <p style="margin-bottom: 0;">An account has automatically been created for this client. You can provide them with these initial credentials:</p>
          <ul style="margin-bottom: 0;">
            <li><strong>Email:</strong> ${booking.userEmail}</li>
            <li><strong>Password:</strong> ${generatedPassword}</li>
          </ul>
        </div>
        ` : ''}

        <br />
        <p>Please log in to the admin dashboard to review this request.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async findAll(): Promise<PackageBooking[]> {
    return await this.bookingRepository.find({
      relations: { package: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PackageBooking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: { package: true },
    });
    if (!booking) {
      throw new NotFoundException(`Booking with ID ${id} not found`);
    }
    return booking;
  }

  async update(id: string, updatePackageBookingDto: UpdatePackageBookingDto): Promise<PackageBooking> {
    const booking = await this.findOne(id);
    Object.assign(booking, updatePackageBookingDto);
    return await this.bookingRepository.save(booking);
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
