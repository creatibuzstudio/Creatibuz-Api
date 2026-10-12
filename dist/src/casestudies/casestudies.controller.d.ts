import { HttpStatus } from '@nestjs/common';
import { CasestudiesService } from './casestudies.service';
import { CreateCasestudyDto } from './dto/create-casestudy.dto';
import { UpdateCasestudyDto } from './dto/update-casestudy.dto';
export declare class CasestudiesController {
    private readonly casestudiesService;
    constructor(casestudiesService: CasestudiesService);
    create(createCasestudyDto: CreateCasestudyDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/casestudy.entity").Casestudy;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/casestudy.entity").Casestudy[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/casestudy.entity").Casestudy;
    }>;
    update(id: string, updateCasestudyDto: UpdateCasestudyDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/casestudy.entity").Casestudy;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
    }>;
}
