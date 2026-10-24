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
var PackageTitleService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTitleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const package_title_entity_1 = require("./entities/package-title.entity");
let PackageTitleService = PackageTitleService_1 = class PackageTitleService {
    constructor(packageTitleRepository) {
        this.packageTitleRepository = packageTitleRepository;
        this.logger = new common_1.Logger(PackageTitleService_1.name);
        this.isTableChecked = false;
    }
    async onModuleInit() {
        await this.ensureTableAndColumnsExist();
    }
    async ensureTableAndColumnsExist() {
        if (this.isTableChecked)
            return;
        try {
            await this.packageTitleRepository.query(`
        CREATE TABLE IF NOT EXISTS "package_titles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(150) NOT NULL,
          "isActive" boolean DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `);
            await this.packageTitleRepository.query(`
        ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "titleId" uuid;
      `);
            await this.packageTitleRepository.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'FK_packages_title'
          ) THEN
            ALTER TABLE "packages" ADD CONSTRAINT "FK_packages_title" FOREIGN KEY ("titleId") REFERENCES "package_titles"("id") ON DELETE SET NULL;
          END IF;
        END $$;
      `);
            const count = await this.packageTitleRepository.count();
            if (count === 0) {
                const defaults = [
                    'Design only',
                    'Design + Development',
                    'Design + Dev + Branding',
                    'Full-Scale Solution',
                    'Starter Plan',
                ];
                for (const name of defaults) {
                    await this.packageTitleRepository.save(this.packageTitleRepository.create({ name, isActive: true }));
                }
                this.logger.log('Seeded default package titles');
            }
            this.isTableChecked = true;
            this.logger.log('Package titles table and package.titleId column verified.');
        }
        catch (err) {
            this.logger.warn(`Could not verify/migrate package_titles: ${err?.message}`);
        }
    }
    async create(createPackageTitleDto) {
        await this.ensureTableAndColumnsExist();
        const title = this.packageTitleRepository.create(createPackageTitleDto);
        return await this.packageTitleRepository.save(title);
    }
    async findAll() {
        await this.ensureTableAndColumnsExist();
        return await this.packageTitleRepository.find({
            relations: { packages: true },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        await this.ensureTableAndColumnsExist();
        const title = await this.packageTitleRepository.findOne({
            where: { id },
            relations: { packages: true },
        });
        if (!title) {
            throw new common_1.NotFoundException(`Package Title with ID ${id} not found`);
        }
        return title;
    }
    async update(id, updatePackageTitleDto) {
        await this.ensureTableAndColumnsExist();
        const title = await this.findOne(id);
        Object.assign(title, updatePackageTitleDto);
        return await this.packageTitleRepository.save(title);
    }
    async remove(id) {
        await this.ensureTableAndColumnsExist();
        const title = await this.findOne(id);
        await this.packageTitleRepository.remove(title);
    }
};
exports.PackageTitleService = PackageTitleService;
exports.PackageTitleService = PackageTitleService = PackageTitleService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(package_title_entity_1.PackageTitle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PackageTitleService);
//# sourceMappingURL=package-title.service.js.map