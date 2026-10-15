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
exports.TimeLog = exports.TimeLogStatus = void 0;
const typeorm_1 = require("typeorm");
var TimeLogStatus;
(function (TimeLogStatus) {
    TimeLogStatus["RUNNING"] = "RUNNING";
    TimeLogStatus["COMPLETED"] = "COMPLETED";
    TimeLogStatus["BREAK"] = "BREAK";
})(TimeLogStatus || (exports.TimeLogStatus = TimeLogStatus = {}));
let TimeLog = class TimeLog {
};
exports.TimeLog = TimeLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TimeLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], TimeLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150 }),
    __metadata("design:type", String)
], TimeLog.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 150, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "userEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "userRole", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "userPicture", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 100, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 15 }),
    __metadata("design:type", String)
], TimeLog.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], TimeLog.prototype, "clockInTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], TimeLog.prototype, "clockOutTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "clockInPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "clockOutPhoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], TimeLog.prototype, "durationSeconds", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 100 }),
    __metadata("design:type", Number)
], TimeLog.prototype, "faceMatchScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 30, default: TimeLogStatus.RUNNING }),
    __metadata("design:type", String)
], TimeLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 60, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 300, nullable: true }),
    __metadata("design:type", String)
], TimeLog.prototype, "device", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TimeLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TimeLog.prototype, "updatedAt", void 0);
exports.TimeLog = TimeLog = __decorate([
    (0, typeorm_1.Entity)('time_logs')
], TimeLog);
//# sourceMappingURL=time-log.entity.js.map