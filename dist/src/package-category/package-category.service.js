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
exports.PackageCategoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const package_category_entity_1 = require("./entities/package-category.entity");
let PackageCategoryService = class PackageCategoryService {
    constructor(packageCategoryRepository) {
        this.packageCategoryRepository = packageCategoryRepository;
    }
    create(createPackageCategoryDto) {
        const category = this.packageCategoryRepository.create(createPackageCategoryDto);
        return this.packageCategoryRepository.save(category);
    }
    findAll() {
        return this.packageCategoryRepository.find({ relations: { packages: true } });
    }
    async findOne(id) {
        const category = await this.packageCategoryRepository.findOne({
            where: { id },
            relations: { packages: true },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Package Category with ID ${id} not found`);
        }
        return category;
    }
    async update(id, updatePackageCategoryDto) {
        const category = await this.findOne(id);
        Object.assign(category, updatePackageCategoryDto);
        return this.packageCategoryRepository.save(category);
    }
    async remove(id) {
        const category = await this.findOne(id);
        return this.packageCategoryRepository.remove(category);
    }
};
exports.PackageCategoryService = PackageCategoryService;
exports.PackageCategoryService = PackageCategoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(package_category_entity_1.PackageCategory)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PackageCategoryService);
//# sourceMappingURL=package-category.service.js.map