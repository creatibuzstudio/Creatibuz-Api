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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancialSetting = void 0;
const typeorm_1 = require("typeorm");
let FinancialSetting = class FinancialSetting {
};
exports.FinancialSetting = FinancialSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], FinancialSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 40 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "companyCostPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "employeePoolPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "leadershipPoolPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], FinancialSetting.prototype, "ceoUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], FinancialSetting.prototype, "cooUserId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 60 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "ceoShareRatio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 40 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "cooShareRatio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 18 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "ceoPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 12 }),
    __metadata("design:type", Number)
], FinancialSetting.prototype, "cooPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], FinancialSetting.prototype, "autoDeductCostFromCompanyFund", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], FinancialSetting.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], FinancialSetting.prototype, "updatedAt", void 0);
exports.FinancialSetting = FinancialSetting = __decorate([
    (0, typeorm_1.Entity)('financial_settings')
], FinancialSetting);
//# sourceMappingURL=financial-setting.entity.js.map