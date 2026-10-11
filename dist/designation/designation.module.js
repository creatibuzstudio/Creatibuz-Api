"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const designation_service_1 = require("./designation.service");
const designation_controller_1 = require("./designation.controller");
const designation_entity_1 = require("./entities/designation.entity");
let DesignationModule = class DesignationModule {
};
exports.DesignationModule = DesignationModule;
exports.DesignationModule = DesignationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([designation_entity_1.Designation])],
        controllers: [designation_controller_1.DesignationController],
        providers: [designation_service_1.DesignationService],
    })
], DesignationModule);
//# sourceMappingURL=designation.module.js.map