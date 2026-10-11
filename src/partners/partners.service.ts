import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly partnerRepository: Repository<Partner>,
  ) {}

  async create(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const partner = this.partnerRepository.create(createPartnerDto);
    return await this.partnerRepository.save(partner);
  }

  async findAll(): Promise<Partner[]> {
    return await this.partnerRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Partner> {
    const partner = await this.partnerRepository.findOne({ where: { id } });
    if (!partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return partner;
  }

  async update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<Partner> {
    const partner = await this.findOne(id);
    Object.assign(partner, updatePartnerDto);
    return await this.partnerRepository.save(partner);
  }

  async remove(id: string): Promise<void> {
    const partner = await this.findOne(id);
    await this.partnerRepository.remove(partner);
  }
}
