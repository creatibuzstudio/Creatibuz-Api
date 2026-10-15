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
exports.ActivityLog = exports.ActivityStatus = exports.ActivityModule = exports.ActivityAction = void 0;
const typeorm_1 = require("typeorm");
var ActivityAction;
(function (ActivityAction) {
    ActivityAction["LOGIN"] = "LOGIN";
    ActivityAction["LOGOUT"] = "LOGOUT";
    ActivityAction["CREATE"] = "CREATE";
    ActivityAction["UPDATE"] = "UPDATE";
    ActivityAction["DELETE"] = "DELETE";
    ActivityAction["DISBURSE_PAYROLL"] = "DISBURSE_PAYROLL";
    ActivityAction["WITHDRAW_SHARE"] = "WITHDRAW_SHARE";
    ActivityAction["APPROVE_EXPENSE"] = "APPROVE_EXPENSE";
    ActivityAction["REJECT_EXPENSE"] = "REJECT_EXPENSE";
    ActivityAction["UPDATE_SETTINGS"] = "UPDATE_SETTINGS";
    ActivityAction["STATUS_CHANGE"] = "STATUS_CHANGE";
    ActivityAction["EXPORT_REPORT"] = "EXPORT_REPORT";
    ActivityAction["DOWNLOAD_STATEMENT"] = "DOWNLOAD_STATEMENT";
    ActivityAction["SYSTEM"] = "SYSTEM";
})(ActivityAction || (exports.ActivityAction = ActivityAction = {}));
var ActivityModule;
(function (ActivityModule) {
    ActivityModule["AUTH"] = "AUTH";
    ActivityModule["USERS"] = "USERS";
    ActivityModule["PAYROLL"] = "PAYROLL";
    ActivityModule["FINANCE"] = "FINANCE";
    ActivityModule["ORDERS"] = "ORDERS";
    ActivityModule["BLOGS"] = "BLOGS";
    ActivityModule["CASE_STUDIES"] = "CASE_STUDIES";
    ActivityModule["PACKAGES"] = "PACKAGES";
    ActivityModule["SETTINGS"] = "SETTINGS";
    ActivityModule["SYSTEM"] = "SYSTEM";
})(ActivityModule || (exports.ActivityModule = ActivityModule = {}));
var ActivityStatus;
(function (ActivityStatus) {
    ActivityStatus["SUCCESS"] = "SUCCESS";
    ActivityStatus["FAILED"] = "FAILED";
    ActivityStatus["WARNING"] = "WARNING";
})(ActivityStatus || (exports.ActivityStatus = ActivityStatus = {}));
let ActivityLog = class ActivityLog {
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, default: 'System User' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userPicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "module", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "targetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "userAgent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 20, default: ActivityStatus.SUCCESS }),
    __metadata("design:type", String)
], ActivityLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "createdAt", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs')
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map