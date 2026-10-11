import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';

@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private designationRepository: Repository<Designation>,
  ) {}

  async create(createDesignationDto: CreateDesignationDto): Promise<Designation> {
    const designation = this.designationRepository.create(createDesignationDto);
    return await this.designationRepository.save(designation);
  }

  async findAll(): Promise<Designation[]> {
    return await this.designationRepository.find();
  }

  async findOne(id: string): Promise<Designation> {
    const designation = await this.designationRepository.findOne({ where: { id } });
    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }
    return designation;
  }

  async update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation> {
    const designation = await this.findOne(id);
    Object.assign(designation, updateDesignationDto);
    return await this.designationRepository.save(designation);
  }

  async remove(id: string): Promise<void> {
    const designation = await this.findOne(id);
    await this.designationRepository.remove(designation);
  }
}
