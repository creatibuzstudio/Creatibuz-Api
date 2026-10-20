import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';
export declare class ContactService {
    private readonly contactRepository;
    private readonly logger;
    private transporter;
    constructor(contactRepository: Repository<Contact>);
    create(createContactDto: CreateContactDto): Promise<Contact>;
    private sendNotificationEmail;
    private sendClientAcknowledgmentEmail;
    findAll(): Promise<Contact[]>;
    findOne(id: string): Promise<Contact>;
    sendFollowUpEmail(dto: {
        contactId?: string;
        to: string;
        subject: string;
        message: string;
        senderName?: string;
    }): Promise<{
        success: boolean;
        message: string;
        messageId: any;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
