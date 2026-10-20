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
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
