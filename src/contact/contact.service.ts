import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as nodemailer from 'nodemailer';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);
  private transporter;

  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {
    const port = Number(process.env.MAIL_PORT) || 465;
    const isSecure = process.env.MAIL_SECURE
      ? process.env.MAIL_SECURE === 'true'
      : port === 465;

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

  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    const savedContact = await this.contactRepository.save(contact);

    // Automatically send notification email to info@creatibuz.com
    this.sendNotificationEmail(savedContact).catch((err) => {
      this.logger.error('Failed to send contact notification email to info@creatibuz.com:', err);
    });

    // Also send confirmation acknowledgment to client
    if (savedContact.email) {
      this.sendClientAcknowledgmentEmail(savedContact).catch((err) => {
        this.logger.warn('Failed to send acknowledgment email to client:', err?.message);
      });
    }

    return savedContact;
  }

  private async sendNotificationEmail(contact: Contact) {
    const adminEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      process.env.MAIL_USER ||
      'info@creatibuz.com';
    const fromAddress =
      process.env.MAIL_FROM ||
      `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #0d1117; color: #f0f6fc; border-radius: 14px; overflow: hidden; border: 1px solid #30363d;">
        <div style="background: linear-gradient(135deg, #FE5A00 0%, #FF8C42 100%); padding: 26px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">New Project Consultation Inquiry</h1>
          <p style="color: rgba(255,255,255,0.92); margin: 6px 0 0 0; font-size: 14px;">Creatibuz Studio &bull; Landing Page Contact Form</p>
        </div>
        
        <div style="padding: 28px 24px;">
          <p style="font-size: 15px; color: #c9d1d9; line-height: 1.6; margin-top: 0; margin-bottom: 20px;">
            A new project inquiry has just been submitted by <strong style="color: #ffffff;">${contact.fullName}</strong>.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
            <tr style="border-bottom: 1px solid #21262d;">
              <td style="padding: 12px 8px; color: #8b949e; width: 140px; font-weight: 600;">Full Name</td>
              <td style="padding: 12px 8px; color: #ffffff; font-weight: 600;">${contact.fullName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #21262d;">
              <td style="padding: 12px 8px; color: #8b949e; font-weight: 600;">Email Address</td>
              <td style="padding: 12px 8px;">
                <a href="mailto:${contact.email}" style="color: #58a6ff; text-decoration: none; font-weight: 500;">${contact.email}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #21262d;">
              <td style="padding: 12px 8px; color: #8b949e; font-weight: 600;">WhatsApp</td>
              <td style="padding: 12px 8px; color: #3fb950; font-weight: 600;">
                ${
                  contact.whatsapp
                    ? `<a href="https://wa.me/${contact.whatsapp.replace(/[^0-9+]/g, '')}" style="color: #25d366; text-decoration: none;">${contact.whatsapp} (Direct Chat)</a>`
                    : '<span style="color: #8b949e;">Not provided</span>'
                }
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #21262d;">
              <td style="padding: 12px 8px; color: #8b949e; font-weight: 600;">Budget Setup</td>
              <td style="padding: 12px 8px; color: #fe5a00; font-weight: 700; font-size: 15px;">${contact.budget || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #8b949e; font-weight: 600; vertical-align: top;">Product Details</td>
              <td style="padding: 14px 12px; color: #f0f6fc; line-height: 1.6; white-space: pre-wrap; background-color: #161b22; border-radius: 8px; font-size: 13.5px; margin-top: 4px;">${contact.productDetails}</td>
            </tr>
          </table>

          <div style="margin-top: 28px; text-align: center;">
            <a href="mailto:${contact.email}?subject=Re:%20Your%20Inquiry%20with%20Creatibuz%20Studio" style="display: inline-block; background-color: #fe5a00; color: #ffffff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 4px 14px rgba(254,90,0,0.35);">Reply to ${contact.fullName}</a>
          </div>
        </div>

        <div style="background-color: #161b22; padding: 16px; text-align: center; font-size: 12px; color: #8b949e; border-top: 1px solid #21262d;">
          This message was automatically generated from <a href="https://creatibuzstudio.com" style="color: #58a6ff; text-decoration: none;">creatibuzstudio.com</a> &bull; Creatibuz Studio
        </div>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: adminEmail,
      replyTo: contact.email,
      subject: `New Inquiry from ${contact.fullName} (${contact.budget || 'Consultation'})`,
      html: htmlContent,
    };

    await this.transporter.sendMail(mailOptions);
    this.logger.log(`Consultation notification email successfully sent to ${adminEmail}`);
  }

  private async sendClientAcknowledgmentEmail(contact: Contact) {
    const fromAddress =
      process.env.MAIL_FROM ||
      `"Creatibuz Studio" <${process.env.MAIL_USER || 'info@creatibuz.com'}>`;

    const clientHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0d1117; color: #f0f6fc; border-radius: 14px; overflow: hidden; border: 1px solid #30363d;">
        <div style="background: linear-gradient(135deg, #FE5A00 0%, #FF8C42 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">We Received Your Inquiry!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0 0; font-size: 14px;">Creatibuz Studio &bull; Digital Experience Agency</p>
        </div>
        
        <div style="padding: 26px 24px;">
          <p style="font-size: 15px; color: #f0f6fc; line-height: 1.6; margin-top: 0;">
            Hi <strong>${contact.fullName}</strong>,
          </p>
          <p style="font-size: 14px; color: #c9d1d9; line-height: 1.6;">
            Thank you for reaching out to Creatibuz Studio! We have received your project details and budget inquiry (<strong>${contact.budget}</strong>).
          </p>
          <p style="font-size: 14px; color: #c9d1d9; line-height: 1.6;">
            Md Abdul Hakim and our team are reviewing your requirements and will get back to you within 24 hours.
          </p>
          
          <div style="margin: 22px 0; padding: 16px; background-color: #161b22; border-radius: 8px; border: 1px solid #21262d;">
            <p style="margin: 0 0 8px 0; font-size: 13px; color: #8b949e; font-weight: 600;">NEED IMMEDIATE ASSISTANCE?</p>
            <p style="margin: 0; font-size: 14px; color: #f0f6fc;">
              You can also reach out directly via WhatsApp: 
              <a href="https://wa.me/+8801968657353" style="color: #25d366; text-decoration: none; font-weight: 600;">+880 1968 657353</a>
            </p>
          </div>
        </div>

        <div style="background-color: #161b22; padding: 14px; text-align: center; font-size: 12px; color: #8b949e; border-top: 1px solid #21262d;">
          Warm regards,<br />
          <strong>The Creatibuz Studio Team</strong><br />
          <a href="https://creatibuzstudio.com" style="color: #58a6ff; text-decoration: none;">creatibuzstudio.com</a>
        </div>
      </div>
    `;

    await this.transporter.sendMail({
      from: fromAddress,
      to: contact.email,
      replyTo: 'info@creatibuz.com',
      subject: `Thank you for contacting Creatibuz Studio, ${contact.fullName}!`,
      html: clientHtml,
    });
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const contact = await this.contactRepository.findOne({ where: { id } });
    if (!contact) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return contact;
  }

  async sendFollowUpEmail(dto: {
    contactId?: string;
    to: string;
    subject: string;
    message: string;
    senderName?: string;
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
          <p style="color: rgba(255,255,255,0.92); margin: 4px 0 0 0; font-size: 13px;">Design &bull; Development &bull; AI Solutions</p>
        </div>
        
        <div style="padding: 28px 24px; line-height: 1.7; font-size: 15px; color: #374151;">
          ${dto.message}
        </div>

        <div style="background-color: #f9fafb; padding: 18px 24px; border-top: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; text-align: center;">
          <p style="margin: 0 0 4px 0; font-weight: 600; color: #374151;">Creatibuz Studio</p>
          <p style="margin: 0 0 6px 0;">Email: <a href="mailto:info@creatibuz.com" style="color: #fe5a00; text-decoration: none;">info@creatibuz.com</a> &bull; WhatsApp: <a href="https://wa.me/+8801968657353" style="color: #25d366; text-decoration: none;">+880 1968 657353</a></p>
          <p style="margin: 0; font-size: 12px; color: #9ca3af;"><a href="https://creatibuzstudio.com" style="color: #fe5a00; text-decoration: none;">creatibuzstudio.com</a></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: fromAddress,
      to: dto.to,
      replyTo: 'info@creatibuz.com',
      subject: dto.subject || 'Follow-up regarding your inquiry with Creatibuz Studio',
      html: htmlContent,
    };

    const info = await this.transporter.sendMail(mailOptions);
    this.logger.log(`Follow-up email successfully sent to ${dto.to} (MessageId: ${info?.messageId})`);

    // If contactId is provided, update contact status to REPLIED
    if (dto.contactId) {
      try {
        const contact = await this.contactRepository.findOne({ where: { id: dto.contactId } });
        if (contact) {
          contact.status = 'REPLIED';
          await this.contactRepository.save(contact);
        }
      } catch (err) {
        this.logger.warn(`Could not update contact status to REPLIED: ${err?.message}`);
      }
    }

    return {
      success: true,
      message: `Follow-up email successfully sent to ${dto.to}`,
      messageId: info?.messageId,
    };
  }

  async remove(id: string) {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return { success: true };
  }
}
