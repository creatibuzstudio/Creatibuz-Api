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
    generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    normalizePayload(dto) {
        const payload = { ...dto };
        if (payload.stats && !payload.metrics) {
            payload.metrics = payload.stats.map((s) => ({
                label: s.label || s.name,
                value: s.value || s.count,
                name: s.name || s.label,
                count: s.count || s.value,
            }));
        }
        else if (payload.metrics && !payload.stats) {
            payload.stats = payload.metrics.map((m) => ({
                name: m.name || m.label,
                count: m.count || m.value,
                label: m.label || m.name,
                value: m.value || m.count,
            }));
        }
        return payload;
    }
    async create(createCasestudyDto) {
        const payload = this.normalizePayload(createCasestudyDto);
        if (!payload.slug && payload.title) {
            const baseSlug = this.generateSlug(payload.title) || 'case-study';
            let slug = baseSlug;
            const existing = await this.casestudyRepository.findOne({ where: { slug } });
            if (existing) {
                slug = `${baseSlug}-${Date.now().toString(36)}`;
            }
            payload.slug = slug;
        }
        const casestudy = this.casestudyRepository.create(payload);
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
    async findBySlug(slug) {
        const casestudy = await this.casestudyRepository.findOne({
            where: { slug },
            relations: { category: true },
        });
        if (!casestudy) {
            throw new common_1.NotFoundException(`Casestudy with slug '${slug}' not found`);
        }
        return casestudy;
    }
    async findOne(idOrSlug) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
        let casestudy = null;
        if (isUuid) {
            casestudy = await this.casestudyRepository.findOne({
                where: { id: idOrSlug },
                relations: { category: true },
            });
        }
        if (!casestudy) {
            casestudy = await this.casestudyRepository.findOne({
                where: { slug: idOrSlug },
                relations: { category: true },
            });
        }
        if (!casestudy) {
            throw new common_1.NotFoundException(`Casestudy with ID or Slug '${idOrSlug}' not found`);
        }
        return casestudy;
    }
    async update(id, updateCasestudyDto) {
        const casestudy = await this.findOne(id);
        const payload = this.normalizePayload(updateCasestudyDto);
        Object.assign(casestudy, payload);
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