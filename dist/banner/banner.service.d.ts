import { Repository } from 'typeorm';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { Banner } from './entities/banner.entity';
export declare class BannerService {
    private bannerRepository;
    constructor(bannerRepository: Repository<Banner>);
    create(createBannerDto: CreateBannerDto): Promise<Banner>;
    findAll(): Promise<Banner[]>;
    findOne(id: string): Promise<Banner>;
    update(id: string, updateBannerDto: UpdateBannerDto): Promise<Banner>;
    remove(id: string): Promise<void>;
}
