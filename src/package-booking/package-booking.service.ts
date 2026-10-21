import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { CreatePackageBookingDto } from './dto/create-package-booking.dto';
import { UpdatePackageBookingDto } from './dto/update-package-booking.dto';
import { PackageBooking } from './entities/package-booking.entity';
import { User, UserRole } from '../users/entities/user.entity';

@Injectable()
export class PackageBookingService implements OnModuleInit {
  private readonly logger = new Logger(PackageBookingService.name);
  private isColumnChecked = false;
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

  async onModuleInit() {
    await this.ensureColumnExists();
  }

  private async ensureColumnExists() {
    if (this.isColumnChecked) return;
    try {
      await this.bookingRepository.query(`
        ALTER TABLE "package_bookings" ADD COLUMN IF NOT EXISTS "whatsappNumber" VARCHAR(50);
      `);
      this.isColumnChecked = true;
      this.logger.log('Ensured "whatsappNumber" column exists in package_bookings table.');
    } catch (err: any) {
      this.logger.warn(`Could not verify/add whatsappNumber column in package_bookings: ${err?.message}`);
    }
  }

  async create(createPackageBookingDto: CreatePackageBookingDto): Promise<PackageBooking> {
    await this.ensureColumnExists();
    const whatsappNumber =
      createPackageBookingDto.whatsappNumber ||
      createPackageBookingDto.whatsapp ||
      null;

    const booking = this.bookingRepository.create({
      ...createPackageBookingDto,
      whatsappNumber: whatsappNumber || undefined,
    });
    const savedBooking = await this.bookingRepository.save(booking);

    // Automatically create a client user if not exists
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

    // Load full relations for email
    const fullBooking = await this.bookingRepository.findOne({
      where: { id: savedBooking.id },
      relations: { package: true },
    });

    this.sendEmailNotification(fullBooking || savedBooking, generatedPassword).catch((err) => {
      console.error('Failed to send package booking email notification:', err);
    });

    return savedBooking;
  }

  private async sendEmailNotification(booking: PackageBooking, generatedPassword?: string) {
    const recipients = Array.from(
      new Set(
        [
          'info@creatibuzstudio.com',
          process.env.SUPERADMIN_EMAIL,
          process.env.MAIL_USER,
        ].filter(Boolean) as string[],
      ),
    ).join(', ');

    const fromAddress =
      process.env.MAIL_FROM || `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;

    const packageName = booking.package?.name || `Package ID: ${booking.packageId}`;
    const packagePrice = booking.package?.price !== undefined ? `$${booking.package?.price}` : 'N/A';
    const waLink = booking.whatsappNumber
      ? `https://wa.me/${booking.whatsappNumber.replace(/[^0-9]/g, '')}`
      : null;

    const mailOptions = {
      from: fromAddress,
      to: recipients,
      replyTo: booking.userEmail,
      subject: `New Package Booking Request from ${booking.name} - ${packageName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; background-color: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #fe5a00 0%, #ff8c42 100%); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">New Package Booking Request</h1>
            <p style="color: rgba(255,255,255,0.92); margin: 6px 0 0 0; font-size: 14px;">Creatibuz Studio Client Booking System</p>
          </div>

          <div style="padding: 24px;">
            <p style="font-size: 15px; margin-top: 0; color: #334155;">
              A new package booking request has been submitted by <strong>${booking.name}</strong>. Details are below:
            </p>

            <table style="width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px;">
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b; width: 35%;">Client Name:</td>
                <td style="padding: 10px 8px; font-weight: 600; color: #0f172a;">${booking.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Client Email:</td>
                <td style="padding: 10px 8px; color: #0f172a;"><a href="mailto:${booking.userEmail}" style="color: #fe5a00; text-decoration: none;">${booking.userEmail}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">WhatsApp Number:</td>
                <td style="padding: 10px 8px; color: #0f172a;">
                  ${
                    waLink
                      ? `<a href="${waLink}" target="_blank" style="color: #25d366; font-weight: bold; text-decoration: none;">${booking.whatsappNumber} (Open WhatsApp)</a>`
                      : '<span style="color: #94a3b8;">Not provided</span>'
                  }
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Company Name:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${booking.companyName || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Company Email:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${booking.companyEmail || 'N/A'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Booked Package:</td>
                <td style="padding: 10px 8px; font-weight: 600; color: #0f172a;">${packageName} (${packagePrice})</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Billing Cycle:</td>
                <td style="padding: 10px 8px; color: #0f172a;">${booking.billingCycle || 'Monthly'}</td>
              </tr>
              <tr>
                <td style="padding: 10px 8px; font-weight: 600; color: #64748b;">Initial Status:</td>
                <td style="padding: 10px 8px; font-weight: bold; color: #f59e0b;">${booking.status || 'PENDING'}</td>
              </tr>
            </table>

            ${
              generatedPassword
                ? `
            <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0f172a; font-size: 15px;">New Client Account Auto-Created</h3>
              <p style="margin-bottom: 8px; font-size: 13px; color: #475569;">You can provide the client with these initial portal credentials:</p>
              <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #0f172a;">
                <li><strong>Email:</strong> ${booking.userEmail}</li>
                <li><strong>Generated Password:</strong> ${generatedPassword}</li>
              </ul>
            </div>
            `
                : ''
            }

            <div style="margin-top: 24px; text-align: center;">
              <a href="https://creatibuzstudio.com" style="display: inline-block; background-color: #fe5a00; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 8px;">View in Admin Panel</a>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 14px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            Creatibuz Studio &bull; <a href="mailto:info@creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">info@creatibuzstudio.com</a> &bull; <a href="https://creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">creatibuzstudio.com</a>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async findAll(): Promise<PackageBooking[]> {
    await this.ensureColumnExists();
    try {
      return await this.bookingRepository.find({
        relations: { package: true },
        order: { createdAt: 'DESC' },
      });
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureColumnExists();
        return await this.bookingRepository.find({
          relations: { package: true },
          order: { createdAt: 'DESC' },
        });
      }
      throw err;
    }
  }

  async findOne(id: string): Promise<PackageBooking> {
    await this.ensureColumnExists();
    try {
      const booking = await this.bookingRepository.findOne({
        where: { id },
        relations: { package: true },
      });
      if (!booking) {
        throw new NotFoundException(`Booking with ID ${id} not found`);
      }
      return booking;
    } catch (err: any) {
      if (err?.code === '42703') {
        this.isColumnChecked = false;
        await this.ensureColumnExists();
        const booking = await this.bookingRepository.findOne({
          where: { id },
          relations: { package: true },
        });
        if (!booking) {
          throw new NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
      }
      throw err;
    }
  }

  async update(id: string, updatePackageBookingDto: UpdatePackageBookingDto): Promise<PackageBooking> {
    const booking = await this.findOne(id);
    const oldStatus = booking.status;

    // Handle whatsapp fallback if passed as whatsapp
    if (updatePackageBookingDto.whatsapp && !updatePackageBookingDto.whatsappNumber) {
      updatePackageBookingDto.whatsappNumber = updatePackageBookingDto.whatsapp;
    }

    Object.assign(booking, updatePackageBookingDto);
    const updated = await this.bookingRepository.save(booking);

    // If status changed, send status update email to the client
    if (updatePackageBookingDto.status && updatePackageBookingDto.status !== oldStatus) {
      this.sendStatusUpdateEmail(updated, oldStatus, updatePackageBookingDto.status).catch((err) => {
        console.error('Failed to send booking status change email:', err);
      });
    }

    return updated;
  }

  private async sendStatusUpdateEmail(booking: PackageBooking, oldStatus: string, newStatus: string) {
    if (!booking.userEmail) return;

    const fromAddress =
      process.env.MAIL_FROM || `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;
    const packageName = booking.package?.name || `Package #${booking.packageId?.slice(0, 8)}`;

    const statusColors: Record<string, string> = {
      CONFIRMED: '#2563eb',
      IN_PROGRESS: '#7c3aed',
      COMPLETED: '#059669',
      CANCELLED: '#e11d48',
      PENDING: '#d97706',
    };
    const badgeColor = statusColors[newStatus.toUpperCase()] || '#fe5a00';

    const mailOptions = {
      from: fromAddress,
      to: booking.userEmail,
      replyTo: 'info@creatibuzstudio.com',
      subject: `Update on your Booking: ${packageName} is now ${newStatus}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="background: linear-gradient(135deg, #fe5a00 0%, #ff8c42 100%); padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Booking Status Updated</h1>
            <p style="color: rgba(255,255,255,0.92); margin: 6px 0 0 0; font-size: 14px;">Creatibuz Studio</p>
          </div>

          <div style="padding: 24px;">
            <p style="font-size: 15px; margin-top: 0; color: #334155;">
              Dear <strong>${booking.name}</strong>,
            </p>
            <p style="font-size: 15px; color: #334155; line-height: 1.6;">
              The status of your package booking for <strong>${packageName}</strong> has been updated:
            </p>

            <div style="margin: 20px 0; padding: 18px; background-color: #f8fafc; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0;">
              <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; font-weight: 600; display: block; margin-bottom: 6px;">New Status</span>
              <span style="display: inline-block; background-color: ${badgeColor}; color: #ffffff; font-weight: 700; font-size: 16px; padding: 6px 20px; border-radius: 9999px;">
                ${newStatus}
              </span>
            </div>

            <p style="font-size: 14px; color: #475569; line-height: 1.6;">
              Our dedicated team is actively managing your service. If you have any questions or need custom requests, feel free to reply to this email or reach us on WhatsApp.
            </p>

            <div style="margin: 20px 0; padding: 14px; background-color: #f1f5f9; border-radius: 8px; border-left: 4px solid #25d366;">
              <p style="margin: 0; font-size: 13px; color: #334155;">
                <strong>Direct WhatsApp Support:</strong>
                <a href="https://wa.me/+8801968657353" style="color: #25d366; text-decoration: none; font-weight: 700; margin-left: 6px;">+880 1968 657353</a>
              </p>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
            Creatibuz Studio &bull; <a href="mailto:info@creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">info@creatibuzstudio.com</a> &bull; <a href="https://creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">creatibuzstudio.com</a>
          </div>
        </div>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendReplyEmail(dto: {
    bookingId?: string;
    to: string;
    subject: string;
    message: string;
    senderName?: string;
    newStatus?: string;
  }) {
    if (!dto.to || !dto.message) {
      throw new NotFoundException('Recipient email and message body are required.');
    }

    const fromAddress =
      process.env.MAIL_FROM ||
      `"${dto.senderName || 'Creatibuz Studio'}" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #ffffff; color: #1f2937; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background: linear-gradient(135deg, #FE5A00 0%, #FF8C42 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">Creatibuz Studio</h1>
          <p style="color: rgba(255,255,255,0.92); margin: 4px 0 0 0; font-size: 13px;">Package Booking Assistance &bull; Client Support</p>
        </div>

        <div style="padding: 28px 24px; line-height: 1.7; font-size: 15px; color: #374151;">
          ${dto.message}
        </div>

        <div style="background-color: #f9fafb; padding: 18px 24px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; text-align: center;">
          <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">Creatibuz Studio</p>
          <p style="margin: 0 0 6px 0;">Email: <a href="mailto:info@creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">info@creatibuzstudio.com</a> &bull; WhatsApp: <a href="https://wa.me/+8801968657353" style="color: #25d366; text-decoration: none;">+880 1968 657353</a></p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;"><a href="https://creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">creatibuzstudio.com</a></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: dto.to,
      replyTo: 'info@creatibuzstudio.com',
      subject: dto.subject || 'Regarding your package booking with Creatibuz Studio',
      html: htmlContent,
    };

    const info = await this.transporter.sendMail(mailOptions);

    // If newStatus is specified or bookingId is provided, optionally update status
    if (dto.bookingId && dto.newStatus) {
      try {
        const booking = await this.bookingRepository.findOne({ where: { id: dto.bookingId } });
        if (booking) {
          booking.status = dto.newStatus;
          await this.bookingRepository.save(booking);
        }
      } catch (err) {
        console.error('Failed to update booking status during reply:', err);
      }
    }

    return {
      success: true,
      message: `Reply email successfully sent to ${dto.to}`,
      messageId: info?.messageId,
    };
  }

  async remove(id: string): Promise<void> {
    const booking = await this.findOne(id);
    await this.bookingRepository.remove(booking);
  }
}
