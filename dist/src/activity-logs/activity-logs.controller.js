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
exports.ActivityLogsController = void 0;
const common_1 = require("@nestjs/common");
const activity_logs_service_1 = require("./activity-logs.service");
const create_activity_log_dto_1 = require("./dto/create-activity-log.dto");
const query_activity_log_dto_1 = require("./dto/query-activity-log.dto");
let ActivityLogsController = class ActivityLogsController {
    constructor(logsService) {
        this.logsService = logsService;
    }
    async findAll(query) {
        const data = await this.logsService.findAll(query);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Activity logs retrieved successfully',
            data,
        };
    }
    async getStats() {
        const data = await this.logsService.getStats();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Activity log metrics retrieved successfully',
            data,
        };
    }
    async getExport(query) {
        const data = await this.logsService.getExportData(query);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Activity logs export data retrieved successfully',
            data,
        };
    }
    async create(dto, req) {
        const clientIp = req?.headers?.['x-forwarded-for'] ||
            req?.socket?.remoteAddress ||
            dto.ipAddress ||
            '127.0.0.1';
        const userAgent = req?.headers?.['user-agent'] || dto.userAgent;
        const data = await this.logsService.create({
            ...dto,
            ipAddress: String(clientIp).split(',')[0].trim(),
            userAgent: userAgent ? String(userAgent).slice(0, 300) : undefined,
        });
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Activity log created successfully',
            data,
        };
    }
};
exports.ActivityLogsController = ActivityLogsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_activity_log_dto_1.QueryActivityLogDto]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('export'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_activity_log_dto_1.QueryActivityLogDto]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "getExport", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_activity_log_dto_1.CreateActivityLogDto, Object]),
    __metadata("design:returntype", Promise)
], ActivityLogsController.prototype, "create", null);
exports.ActivityLogsController = ActivityLogsController = __decorate([
    (0, common_1.Controller)(['activity-logs', 'logs']),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogsController);
//# sourceMappingURL=activity-logs.controller.js.map