"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageCategoryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const package_category_service_1 = require("./package-category.service");
const package_category_controller_1 = require("./package-category.controller");
const package_category_entity_1 = require("./entities/package-category.entity");
let PackageCategoryModule = class PackageCategoryModule {
};
exports.PackageCategoryModule = PackageCategoryModule;
exports.PackageCategoryModule = PackageCategoryModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([package_category_entity_1.PackageCategory])],
        controllers: [package_category_controller_1.PackageCategoryController],
        providers: [package_category_service_1.PackageCategoryService],
    })
], PackageCategoryModule);
//# sourceMappingURL=package-category.module.js.map