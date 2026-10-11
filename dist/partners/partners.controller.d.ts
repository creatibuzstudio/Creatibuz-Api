import { HttpStatus } from '@nestjs/common';
import { PartnersService } from './partners.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
export declare class PartnersController {
    private readonly partnersService;
    constructor(partnersService: PartnersService);
    create(createPartnerDto: CreatePartnerDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/partner.entity").Partner;
    }>;
    findAll(): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/partner.entity").Partner[];
    }>;
    findOne(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/partner.entity").Partner;
    }>;
    update(id: string, updatePartnerDto: UpdatePartnerDto): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: import("./entities/partner.entity").Partner;
    }>;
    remove(id: string): Promise<{
        statusCode: HttpStatus;
        message: string;
        data: null;
    }>;
}
