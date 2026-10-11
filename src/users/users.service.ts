import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { departmentId, designationId, password, ...rest } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const payload: DeepPartial<User> = { ...rest, password: hashedPassword };
    if (departmentId) payload.department = { id: departmentId } as any;
    if (designationId) payload.designation = { id: designationId } as any;

    const user = this.userRepository.create(payload);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: { department: true, designation: true },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { department: true, designation: true },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const { departmentId, designationId, password, ...rest } = updateUserDto;

    if (password) {
      rest['password'] = await bcrypt.hash(password, 10);
    }

    Object.assign(user, rest);
    if (departmentId !== undefined) {
      user.department = departmentId ? ({ id: departmentId } as any) : null;
    }
    if (designationId !== undefined) {
      user.designation = designationId ? ({ id: designationId } as any) : null;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
