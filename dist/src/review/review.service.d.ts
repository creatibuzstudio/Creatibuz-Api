import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
export declare class ReviewService {
    private reviewRepository;
    constructor(reviewRepository: Repository<Review>);
    create(createReviewDto: CreateReviewDto): Promise<Review>;
    findAll(): Promise<Review[]>;
    findOne(id: string): Promise<Review>;
    update(id: string, updateReviewDto: UpdateReviewDto): Promise<Review>;
    remove(id: string): Promise<void>;
}
