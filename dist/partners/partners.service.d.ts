import { Repository } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
export declare class PartnersService {
    private readonly partnerRepository;
    constructor(partnerRepository: Repository<Partner>);
    create(createPartnerDto: CreatePartnerDto): Promise<Partner>;
    findAll(): Promise<Partner[]>;
    findOne(id: string): Promise<Partner>;
    update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner>;
    remove(id: string): Promise<void>;
}
