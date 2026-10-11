import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Casestudy)
    private casestudyRepository: Repository<Casestudy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}

  async getStats() {
    const projectDeliveries = await this.casestudyRepository.count();
    const inHouseExperts = await this.userRepository.count();
    const businessPartners = await this.partnerRepository.count();

    // Default to a minimum if empty so the landing page looks good for a new install
    return {
      projectDeliveries: Math.max(projectDeliveries, 50),
      inHouseExperts: Math.max(inHouseExperts, 15),
      satisfiedClients: 99, // Static representation of 99%
      businessPartners: Math.max(businessPartners, 5),
    };
  }
}
