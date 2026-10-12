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
exports.CasestudiesController = void 0;
const common_1 = require("@nestjs/common");
const casestudies_service_1 = require("./casestudies.service");
const create_casestudy_dto_1 = require("./dto/create-casestudy.dto");
const update_casestudy_dto_1 = require("./dto/update-casestudy.dto");
let CasestudiesController = class CasestudiesController {
    constructor(casestudiesService) {
        this.casestudiesService = casestudiesService;
    }
    async create(createCasestudyDto) {
        const data = await this.casestudiesService.create(createCasestudyDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Casestudy created successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.casestudiesService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Casestudies retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.casestudiesService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Casestudy retrieved successfully',
            data,
        };
    }
    async update(id, updateCasestudyDto) {
        const data = await this.casestudiesService.update(id, updateCasestudyDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Casestudy updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.casestudiesService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Casestudy removed successfully',
        };
    }
};
exports.CasestudiesController = CasestudiesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_casestudy_dto_1.CreateCasestudyDto]),
    __metadata("design:returntype", Promise)
], CasestudiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CasestudiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasestudiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_casestudy_dto_1.UpdateCasestudyDto]),
    __metadata("design:returntype", Promise)
], CasestudiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CasestudiesController.prototype, "remove", null);
exports.CasestudiesController = CasestudiesController = __decorate([
    (0, common_1.Controller)('casestudies'),
    __metadata("design:paramtypes", [casestudies_service_1.CasestudiesService])
], CasestudiesController);
//# sourceMappingURL=casestudies.controller.js.map