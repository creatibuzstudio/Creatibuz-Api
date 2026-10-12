import { Repository } from 'typeorm';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from './entities/department.entity';
export declare class DepartmentService {
    private departmentRepository;
    constructor(departmentRepository: Repository<Department>);
    create(createDepartmentDto: CreateDepartmentDto): Promise<Department>;
    findAll(): Promise<Department[]>;
    findOne(id: string): Promise<Department>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<Department>;
    remove(id: string): Promise<void>;
}
