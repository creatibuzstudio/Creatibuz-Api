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
var PackageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const package_entity_1 = require("./entities/package.entity");
let PackageService = PackageService_1 = class PackageService {
    constructor(packageRepository) {
        this.packageRepository = packageRepository;
        this.logger = new common_1.Logger(PackageService_1.name);
        this.isColumnChecked = false;
    }
    async onModuleInit() {
        await this.ensureTitleColumn();
    }
    async ensureTitleColumn() {
        if (this.isColumnChecked)
            return;
        try {
            await this.packageRepository.query(`
        ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "title" VARCHAR(150);
      `);
            this.isColumnChecked = true;
            this.logger.log('Ensured "title" column exists in packages table.');
        }
        catch (err) {
            this.logger.warn(`Could not verify/add title column in packages: ${err?.message}`);
        }
    }
    async create(createPackageDto) {
        await this.ensureTitleColumn();
        const pkg = this.packageRepository.create(createPackageDto);
        if (createPackageDto.categoryId) {
            pkg.category = { id: createPackageDto.categoryId };
        }
        return await this.packageRepository.save(pkg);
    }
    async findAll() {
        await this.ensureTitleColumn();
        try {
            return await this.packageRepository.find({
                relations: { category: true },
                order: { createdAt: 'DESC' },
            });
        }
        catch (err) {
            if (err?.code === '42703') {
                this.isColumnChecked = false;
                await this.ensureTitleColumn();
                return await this.packageRepository.find({
                    relations: { category: true },
                    order: { createdAt: 'DESC' },
                });
            }
            throw err;
        }
    }
    async findOne(id) {
        await this.ensureTitleColumn();
        try {
            const pkg = await this.packageRepository.findOne({
                where: { id },
                relations: { category: true }
            });
            if (!pkg) {
                throw new common_1.NotFoundException(`Package with ID ${id} not found`);
            }
            return pkg;
        }
        catch (err) {
            if (err?.code === '42703') {
                this.isColumnChecked = false;
                await this.ensureTitleColumn();
                const pkg = await this.packageRepository.findOne({
                    where: { id },
                    relations: { category: true }
                });
                if (!pkg) {
                    throw new common_1.NotFoundException(`Package with ID ${id} not found`);
                }
                return pkg;
            }
            throw err;
        }
    }
    async update(id, updatePackageDto) {
        await this.ensureTitleColumn();
        const pkg = await this.findOne(id);
        Object.assign(pkg, updatePackageDto);
        if (updatePackageDto.categoryId) {
            pkg.category = { id: updatePackageDto.categoryId };
        }
        return await this.packageRepository.save(pkg);
    }
    async remove(id) {
        const pkg = await this.findOne(id);
        await this.packageRepository.remove(pkg);
    }
};
exports.PackageService = PackageService;
exports.PackageService = PackageService = PackageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(package_entity_1.Package)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PackageService);
//# sourceMappingURL=package.service.js.map