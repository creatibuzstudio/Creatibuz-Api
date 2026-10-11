import { HttpStatus } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
export declare class DepartmentController {
    private readonly departmentService;
    constructor(departmentService: DepartmentService);
    create(createDepartmentDto: CreateDepartmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/department.entity").Department;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/department.entity").Department[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/department.entity").Department;
    }>;
    update(id: string, updateDepartmentDto: UpdateDepartmentDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/department.entity").Department;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
