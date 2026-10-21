"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageBookingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nodemailer = __importStar(require("nodemailer"));
const bcrypt = __importStar(require("bcrypt"));
const package_booking_entity_1 = require("./entities/package-booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
let PackageBookingService = class PackageBookingService {
    constructor(bookingRepository, userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
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
    async create(createPackageBookingDto) {
        const whatsappNumber = createPackageBookingDto.whatsappNumber ||
            createPackageBookingDto.whatsapp ||
            null;
        const booking = this.bookingRepository.create({
            ...createPackageBookingDto,
            whatsappNumber: whatsappNumber || undefined,
        });
        const savedBooking = await this.bookingRepository.save(booking);
        let generatedPassword = '';
        const existingUser = await this.userRepository.findOne({ where: { email: savedBooking.userEmail } });
        if (!existingUser) {
            generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);
            const newUser = this.userRepository.create({
                name: savedBooking.name,
                email: savedBooking.userEmail,
                password: hashedPassword,
                role: user_entity_1.UserRole.CLIENT,
            });
            await this.userRepository.save(newUser);
        }
        const fullBooking = await this.bookingRepository.findOne({
            where: { id: savedBooking.id },
            relations: { package: true },
        });
        this.sendEmailNotification(fullBooking || savedBooking, generatedPassword).catch((err) => {
            console.error('Failed to send package booking email notification:', err);
        });
        return savedBooking;
    }
    async sendEmailNotification(booking, generatedPassword) {
        const recipients = Array.from(new Set([
            'info@creatibuzstudio.com',
            process.env.SUPERADMIN_EMAIL,
            process.env.MAIL_USER,
        ].filter(Boolean))).join(', ');
        const fromAddress = process.env.MAIL_FROM || `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;
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
                  ${waLink
                ? `<a href="${waLink}" target="_blank" style="color: #25d366; font-weight: bold; text-decoration: none;">${booking.whatsappNumber} (Open WhatsApp)</a>`
                : '<span style="color: #94a3b8;">Not provided</span>'}
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

            ${generatedPassword
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
                : ''}

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
    async findAll() {
        return await this.bookingRepository.find({
            relations: { package: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const booking = await this.bookingRepository.findOne({
            where: { id },
            relations: { package: true },
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updatePackageBookingDto) {
        const booking = await this.findOne(id);
        const oldStatus = booking.status;
        if (updatePackageBookingDto.whatsapp && !updatePackageBookingDto.whatsappNumber) {
            updatePackageBookingDto.whatsappNumber = updatePackageBookingDto.whatsapp;
        }
        Object.assign(booking, updatePackageBookingDto);
        const updated = await this.bookingRepository.save(booking);
        if (updatePackageBookingDto.status && updatePackageBookingDto.status !== oldStatus) {
            this.sendStatusUpdateEmail(updated, oldStatus, updatePackageBookingDto.status).catch((err) => {
                console.error('Failed to send booking status change email:', err);
            });
        }
        return updated;
    }
    async sendStatusUpdateEmail(booking, oldStatus, newStatus) {
        if (!booking.userEmail)
            return;
        const fromAddress = process.env.MAIL_FROM || `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;
        const packageName = booking.package?.name || `Package #${booking.packageId?.slice(0, 8)}`;
        const statusColors = {
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
    async sendReplyEmail(dto) {
        if (!dto.to || !dto.message) {
            throw new common_1.NotFoundException('Recipient email and message body are required.');
        }
        const fromAddress = process.env.MAIL_FROM ||
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
        if (dto.bookingId && dto.newStatus) {
            try {
                const booking = await this.bookingRepository.findOne({ where: { id: dto.bookingId } });
                if (booking) {
                    booking.status = dto.newStatus;
                    await this.bookingRepository.save(booking);
                }
            }
            catch (err) {
                console.error('Failed to update booking status during reply:', err);
            }
        }
        return {
            success: true,
            message: `Reply email successfully sent to ${dto.to}`,
            messageId: info?.messageId,
        };
    }
    async remove(id) {
        const booking = await this.findOne(id);
        await this.bookingRepository.remove(booking);
    }
};
exports.PackageBookingService = PackageBookingService;
exports.PackageBookingService = PackageBookingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(package_booking_entity_1.PackageBooking)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PackageBookingService);
//# sourceMappingURL=package-booking.service.js.map