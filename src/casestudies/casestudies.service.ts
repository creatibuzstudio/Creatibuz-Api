import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCasestudyDto } from './dto/create-casestudy.dto';
import { UpdateCasestudyDto } from './dto/update-casestudy.dto';
import { Casestudy } from './entities/casestudy.entity';

@Injectable()
export class CasestudiesService {
  constructor(
    @InjectRepository(Casestudy)
    private casestudyRepository: Repository<Casestudy>,
  ) {}

  async create(createCasestudyDto: CreateCasestudyDto): Promise<Casestudy> {
    const casestudy = this.casestudyRepository.create(createCasestudyDto);
    return await this.casestudyRepository.save(casestudy);
  }

  async findAll(): Promise<Casestudy[]> {
    return await this.casestudyRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
      relations: {
        category: true,
      },
    });
  }

  async findOne(id: string): Promise<Casestudy> {
    const casestudy = await this.casestudyRepository.findOne({ 
      where: { id },
      relations: { category: true },
    });
    if (!casestudy) {
      throw new NotFoundException(`Casestudy with ID ${id} not found`);
    }
    return casestudy;
  }

  async update(id: string, updateCasestudyDto: UpdateCasestudyDto): Promise<Casestudy> {
    const casestudy = await this.findOne(id);
    Object.assign(casestudy, updateCasestudyDto);
    return await this.casestudyRepository.save(casestudy);
  }

  async remove(id: string): Promise<void> {
    const casestudy = await this.findOne(id);
    await this.casestudyRepository.remove(casestudy);
  }
}
