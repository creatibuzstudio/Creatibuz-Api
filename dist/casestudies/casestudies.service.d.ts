import { Repository } from 'typeorm';
import { CreateCasestudyDto } from './dto/create-casestudy.dto';
import { UpdateCasestudyDto } from './dto/update-casestudy.dto';
import { Casestudy } from './entities/casestudy.entity';
export declare class CasestudiesService {
    private casestudyRepository;
    constructor(casestudyRepository: Repository<Casestudy>);
    create(createCasestudyDto: CreateCasestudyDto): Promise<Casestudy>;
    findAll(): Promise<Casestudy[]>;
    findOne(id: string): Promise<Casestudy>;
    update(id: string, updateCasestudyDto: UpdateCasestudyDto): Promise<Casestudy>;
    remove(id: string): Promise<void>;
}
