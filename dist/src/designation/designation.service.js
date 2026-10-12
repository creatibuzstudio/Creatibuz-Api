"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const designation_entity_1 = require("./entities/designation.entity");
let DesignationService = class DesignationService {
    constructor(designationRepository) {
        this.designationRepository = designationRepository;
    }
    async create(createDesignationDto) {
        const designation = this.designationRepository.create(createDesignationDto);
        return await this.designationRepository.save(designation);
    }
    async findAll() {
        return await this.designationRepository.find();
    }
    async findOne(id) {
        const designation = await this.designationRepository.findOne({ where: { id } });
        if (!designation) {
            throw new common_1.NotFoundException(`Designation with ID ${id} not found`);
        }
        return designation;
    }
    async update(id, updateDesignationDto) {
        const designation = await this.findOne(id);
        Object.assign(designation, updateDesignationDto);
        return await this.designationRepository.save(designation);
    }
    async remove(id) {
        const designation = await this.findOne(id);
        await this.designationRepository.remove(designation);
    }
};
exports.DesignationService = DesignationService;
exports.DesignationService = DesignationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(designation_entity_1.Designation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DesignationService);
//# sourceMappingURL=designation.service.js.map