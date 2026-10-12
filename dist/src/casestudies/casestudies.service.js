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
exports.CasestudiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const casestudy_entity_1 = require("./entities/casestudy.entity");
let CasestudiesService = class CasestudiesService {
    constructor(casestudyRepository) {
        this.casestudyRepository = casestudyRepository;
    }
    async create(createCasestudyDto) {
        const casestudy = this.casestudyRepository.create(createCasestudyDto);
        return await this.casestudyRepository.save(casestudy);
    }
    async findAll() {
        return await this.casestudyRepository.find({
            order: {
                order: 'ASC',
                createdAt: 'DESC',
            },
            relations: {
                category: true,
            },
        });
    }
    async findOne(id) {
        const casestudy = await this.casestudyRepository.findOne({
            where: { id },
            relations: { category: true },
        });
        if (!casestudy) {
            throw new common_1.NotFoundException(`Casestudy with ID ${id} not found`);
        }
        return casestudy;
    }
    async update(id, updateCasestudyDto) {
        const casestudy = await this.findOne(id);
        Object.assign(casestudy, updateCasestudyDto);
        return await this.casestudyRepository.save(casestudy);
    }
    async remove(id) {
        const casestudy = await this.findOne(id);
        await this.casestudyRepository.remove(casestudy);
    }
};
exports.CasestudiesService = CasestudiesService;
exports.CasestudiesService = CasestudiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casestudy_entity_1.Casestudy)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CasestudiesService);
//# sourceMappingURL=casestudies.service.js.map