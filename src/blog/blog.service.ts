import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogRepository.create(createBlogDto);
    return await this.blogRepository.save(blog);
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { id } });
    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    const updated = Object.assign(blog, updateBlogDto);
    return await this.blogRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
  }
}
