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
exports.TimeTrackerController = void 0;
const common_1 = require("@nestjs/common");
const time_tracker_service_1 = require("./time-tracker.service");
const clock_in_dto_1 = require("./dto/clock-in.dto");
const clock_out_dto_1 = require("./dto/clock-out.dto");
const query_time_log_dto_1 = require("./dto/query-time-log.dto");
let TimeTrackerController = class TimeTrackerController {
    constructor(timeTrackerService) {
        this.timeTrackerService = timeTrackerService;
    }
    async clockIn(dto, req) {
        const clientIp = req?.headers?.['x-forwarded-for'] ||
            req?.socket?.remoteAddress ||
            dto.ipAddress ||
            '127.0.0.1';
        const userAgent = req?.headers?.['user-agent'] || dto.device;
        const data = await this.timeTrackerService.clockIn({
            ...dto,
            ipAddress: String(clientIp).split(',')[0].trim(),
            device: userAgent ? String(userAgent).slice(0, 300) : undefined,
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Clock-in session started with webcam photo verification',
            data,
        };
    }
    async clockOut(dto, req) {
        const clientIp = req?.headers?.['x-forwarded-for'] ||
            req?.socket?.remoteAddress ||
            dto.ipAddress ||
            '127.0.0.1';
        const userAgent = req?.headers?.['user-agent'] || dto.device;
        const data = await this.timeTrackerService.clockOut({
            ...dto,
            ipAddress: String(clientIp).split(',')[0].trim(),
            device: userAgent ? String(userAgent).slice(0, 300) : undefined,
        });
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Work session completed and logged successfully',
            data,
        };
    }
    async getActiveSession(userId) {
        const data = await this.timeTrackerService.getActiveSession(userId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Active session retrieved',
            data,
        };
    }
    async getMyWorkReport(userId, query) {
        const data = await this.timeTrackerService.getMyWorkReport(userId, query);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Employee work report and goal progress retrieved',
            data,
        };
    }
    async getAdminLiveSessions() {
        const data = await this.timeTrackerService.getAdminLiveSessions();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Live active employee sessions retrieved',
            data,
        };
    }
    async getAdminAllSessions(query) {
        const data = await this.timeTrackerService.getAdminAllSessions(query);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'All employee sessions retrieved',
            data,
        };
    }
    async getAdminDailyReport(date) {
        const data = await this.timeTrackerService.getAdminDailyReport(date);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Daily attendance and 6-hour compliance report retrieved',
            data,
        };
    }
};
exports.TimeTrackerController = TimeTrackerController;
__decorate([
    (0, common_1.Post)('clock-in'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_in_dto_1.ClockInDto, Object]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "clockIn", null);
__decorate([
    (0, common_1.Post)('clock-out'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [clock_out_dto_1.ClockOutDto, Object]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "clockOut", null);
__decorate([
    (0, common_1.Get)('active'),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "getActiveSession", null);
__decorate([
    (0, common_1.Get)('my-report'),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_time_log_dto_1.QueryTimeLogDto]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "getMyWorkReport", null);
__decorate([
    (0, common_1.Get)('admin/live'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "getAdminLiveSessions", null);
__decorate([
    (0, common_1.Get)('admin/sessions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_time_log_dto_1.QueryTimeLogDto]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "getAdminAllSessions", null);
__decorate([
    (0, common_1.Get)('admin/daily-report'),
    __param(0, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TimeTrackerController.prototype, "getAdminDailyReport", null);
exports.TimeTrackerController = TimeTrackerController = __decorate([
    (0, common_1.Controller)('time-tracker'),
    __metadata("design:paramtypes", [time_tracker_service_1.TimeTrackerService])
], TimeTrackerController);
//# sourceMappingURL=time-tracker.controller.js.map