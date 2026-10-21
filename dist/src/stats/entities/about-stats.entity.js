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
exports.AboutStatsSetting = void 0;
const typeorm_1 = require("typeorm");
let AboutStatsSetting = class AboutStatsSetting {
};
exports.AboutStatsSetting = AboutStatsSetting;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AboutStatsSetting.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 400 }),
    __metadata("design:type", Number)
], AboutStatsSetting.prototype, "projectDeliveries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 15 }),
    __metadata("design:type", Number)
], AboutStatsSetting.prototype, "inHouseExperts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 99 }),
    __metadata("design:type", Number)
], AboutStatsSetting.prototype, "satisfiedClients", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 40 }),
    __metadata("design:type", Number)
], AboutStatsSetting.prototype, "businessPartners", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AboutStatsSetting.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AboutStatsSetting.prototype, "updatedAt", void 0);
exports.AboutStatsSetting = AboutStatsSetting = __decorate([
    (0, typeorm_1.Entity)('about_stats')
], AboutStatsSetting);
//# sourceMappingURL=about-stats.entity.js.map