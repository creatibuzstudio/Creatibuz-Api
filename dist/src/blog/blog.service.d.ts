import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';
export declare class BlogService {
    private blogRepository;
    constructor(blogRepository: Repository<Blog>);
    private generateSlug;
    private normalizeMetadata;
    create(createBlogDto: CreateBlogDto): Promise<Blog>;
    findAll(): Promise<Blog[]>;
    findBySlug(slug: string): Promise<Blog>;
    incrementViews(idOrSlug: string): Promise<Blog>;
    findOne(idOrSlug: string): Promise<Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog>;
    remove(id: string): Promise<void>;
}
