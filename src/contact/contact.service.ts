import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto) {
    const contact = this.contactRepository.create(createContactDto);
    return await this.contactRepository.save(contact);
  }

  async findAll() {
    return await this.contactRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: string) {
    const result = await this.contactRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Contact #${id} not found`);
    }
    return { success: true };
  }
}
