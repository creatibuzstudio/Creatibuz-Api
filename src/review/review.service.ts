import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...createReviewDto,
      client: { id: createReviewDto.clientId },
    });
    return await this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewRepository.find({
      relations: {
        client: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({ 
      where: { id },
      relations: {
        client: true,
      } 
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    
    if (updateReviewDto.clientId) {
      review.client = { id: updateReviewDto.clientId } as any;
    }
    
    const updated = Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
