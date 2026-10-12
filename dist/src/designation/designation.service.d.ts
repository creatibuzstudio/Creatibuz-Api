import { Repository } from 'typeorm';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { Designation } from './entities/designation.entity';
export declare class DesignationService {
    private designationRepository;
    constructor(designationRepository: Repository<Designation>);
    create(createDesignationDto: CreateDesignationDto): Promise<Designation>;
    findAll(): Promise<Designation[]>;
    findOne(id: string): Promise<Designation>;
    update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<Designation>;
    remove(id: string): Promise<void>;
}
