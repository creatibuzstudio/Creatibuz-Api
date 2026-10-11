import { HttpStatus } from '@nestjs/common';
import { DesignationService } from './designation.service';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
export declare class DesignationController {
    private readonly designationService;
    constructor(designationService: DesignationService);
    create(createDesignationDto: CreateDesignationDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/designation.entity").Designation;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/designation.entity").Designation[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/designation.entity").Designation;
    }>;
    update(id: string, updateDesignationDto: UpdateDesignationDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/designation.entity").Designation;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
