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
exports.PayrollItem = exports.PayrollItemStatus = exports.PayrollRecipientType = void 0;
const typeorm_1 = require("typeorm");
const monthly_payroll_entity_1 = require("./monthly-payroll.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var PayrollRecipientType;
(function (PayrollRecipientType) {
    PayrollRecipientType["EMPLOYEE"] = "employee";
    PayrollRecipientType["CEO"] = "ceo";
    PayrollRecipientType["COO"] = "coo";
})(PayrollRecipientType || (exports.PayrollRecipientType = PayrollRecipientType = {}));
var PayrollItemStatus;
(function (PayrollItemStatus) {
    PayrollItemStatus["PENDING"] = "pending";
    PayrollItemStatus["PAID"] = "paid";
    PayrollItemStatus["WITHDRAWN"] = "withdrawn";
})(PayrollItemStatus || (exports.PayrollItemStatus = PayrollItemStatus = {}));
let PayrollItem = class PayrollItem {
};
exports.PayrollItem = PayrollItem;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PayrollItem.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => monthly_payroll_entity_1.MonthlyPayroll, (payroll) => payroll.items, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", monthly_payroll_entity_1.MonthlyPayroll)
], PayrollItem.prototype, "monthlyPayroll", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], PayrollItem.prototype, "monthlyPayrollId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    __metadata("design:type", user_entity_1.User)
], PayrollItem.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], PayrollItem.prototype, "recipientName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "recipientEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "recipientRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayrollRecipientType,
        default: PayrollRecipientType.EMPLOYEE,
    }),
    __metadata("design:type", String)
], PayrollItem.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "baseSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "profitSharePercent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "profitShareAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "bonus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "deductions", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], PayrollItem.prototype, "netPayable", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PayrollItemStatus,
        default: PayrollItemStatus.PENDING,
    }),
    __metadata("design:type", String)
], PayrollItem.prototype, "paymentStatus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "paymentMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "transactionReference", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "voucherNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PayrollItem.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], PayrollItem.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PayrollItem.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PayrollItem.prototype, "updatedAt", void 0);
exports.PayrollItem = PayrollItem = __decorate([
    (0, typeorm_1.Entity)('payroll_items')
], PayrollItem);
//# sourceMappingURL=payroll-item.entity.js.map