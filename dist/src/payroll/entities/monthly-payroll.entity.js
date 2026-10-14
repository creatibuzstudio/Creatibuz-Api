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
exports.MonthlyPayroll = exports.PayrollStatus = void 0;
const typeorm_1 = require("typeorm");
const payroll_item_entity_1 = require("./payroll-item.entity");
var PayrollStatus;
(function (PayrollStatus) {
    PayrollStatus["DRAFT"] = "draft";
    PayrollStatus["APPROVED"] = "approved";
    PayrollStatus["PAID"] = "paid";
})(PayrollStatus || (exports.PayrollStatus = PayrollStatus = {}));
let MonthlyPayroll = class MonthlyPayroll {
};
exports.MonthlyPayroll = MonthlyPayroll;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 10, unique: true }),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "monthYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50 }),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "monthName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayrollStatus,
        default: PayrollStatus.DRAFT,
    }),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "totalOrderRevenue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 40 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "companyCostPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "companyCostAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "employeePoolPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "employeePoolAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 30 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "leadershipPoolPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "leadershipPoolAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 20 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "ceoPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "ceoAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 40 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "cooPercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "cooAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "totalBaseSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "totalProfitShare", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], MonthlyPayroll.prototype, "totalEmployeesPaid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MonthlyPayroll.prototype, "processedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MonthlyPayroll.prototype, "disbursedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "processedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MonthlyPayroll.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payroll_item_entity_1.PayrollItem, (item) => item.monthlyPayroll, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], MonthlyPayroll.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], MonthlyPayroll.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], MonthlyPayroll.prototype, "updatedAt", void 0);
exports.MonthlyPayroll = MonthlyPayroll = __decorate([
    (0, typeorm_1.Entity)('monthly_payrolls')
], MonthlyPayroll);
//# sourceMappingURL=monthly-payroll.entity.js.map