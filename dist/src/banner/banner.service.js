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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const banner_entity_1 = require("./entities/banner.entity");
let BannerService = class BannerService {
    constructor(bannerRepository) {
        this.bannerRepository = bannerRepository;
    }
    async create(createBannerDto) {
        const banner = this.bannerRepository.create(createBannerDto);
        return await this.bannerRepository.save(banner);
    }
    async findAll() {
        return await this.bannerRepository.find({
            order: {
                order: 'ASC',
                createdAt: 'DESC',
            }
        });
    }
    async findOne(id) {
        const banner = await this.bannerRepository.findOne({ where: { id } });
        if (!banner) {
            throw new common_1.NotFoundException(`Banner with ID ${id} not found`);
        }
        return banner;
    }
    async update(id, updateBannerDto) {
        const banner = await this.findOne(id);
        Object.assign(banner, updateBannerDto);
        return await this.bannerRepository.save(banner);
    }
    async remove(id) {
        const banner = await this.findOne(id);
        await this.bannerRepository.remove(banner);
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(banner_entity_1.Banner)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BannerService);
//# sourceMappingURL=banner.service.js.map