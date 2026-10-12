import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    create(createBlogDto: CreateBlogDto): Promise<import("./entities/blog.entity").Blog>;
    findAll(): Promise<import("./entities/blog.entity").Blog[]>;
    findOne(id: string): Promise<import("./entities/blog.entity").Blog>;
    update(id: string, updateBlogDto: UpdateBlogDto): Promise<import("./entities/blog.entity").Blog>;
    remove(id: string): Promise<void>;
}
