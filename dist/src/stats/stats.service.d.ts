import { Repository } from 'typeorm';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';
export declare class StatsService {
    private casestudyRepository;
    private userRepository;
    private partnerRepository;
    constructor(casestudyRepository: Repository<Casestudy>, userRepository: Repository<User>, partnerRepository: Repository<Partner>);
    getStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
    }>;
}
