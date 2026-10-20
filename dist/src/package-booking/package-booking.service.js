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
        const booking = this.bookingRepository.create(createPackageBookingDto);
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
        this.sendEmailNotification(savedBooking, generatedPassword).catch((err) => {
            console.error('Failed to send package booking email notification:', err);
        });
        return savedBooking;
    }
    async sendEmailNotification(booking, generatedPassword) {
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
        Object.assign(booking, updatePackageBookingDto);
        return await this.bookingRepository.save(booking);
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