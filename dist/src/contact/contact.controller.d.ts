import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto): Promise<import("./entities/contact.entity").Contact>;
    findAll(): Promise<import("./entities/contact.entity").Contact[]>;
    findOne(id: string): Promise<import("./entities/contact.entity").Contact>;
    sendFollowUp(body: {
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
