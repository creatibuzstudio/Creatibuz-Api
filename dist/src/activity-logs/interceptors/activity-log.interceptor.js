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
exports.ActivityLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const activity_logs_service_1 = require("../activity-logs.service");
const activity_log_entity_1 = require("../entities/activity-log.entity");
let ActivityLogInterceptor = class ActivityLogInterceptor {
    constructor(logsService) {
        this.logsService = logsService;
    }
    intercept(context, next) {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const method = req.method;
        const url = req.originalUrl || req.url || '';
        const isMutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
        const isLogsPath = url.includes('/activity-logs') || url.includes('/logs');
        if (!isMutating || isLogsPath) {
            return next.handle();
        }
        return next.handle().pipe((0, operators_1.tap)({
            next: (responseBody) => {
                this.logRequest(req, responseBody, activity_log_entity_1.ActivityStatus.SUCCESS).catch(() => { });
            },
            error: (err) => {
                this.logRequest(req, { error: err.message }, activity_log_entity_1.ActivityStatus.FAILED).catch(() => { });
            },
        }));
    }
    async logRequest(req, responseData, status) {
        try {
            const url = req.originalUrl || req.url || '';
            const method = req.method;
            const body = req.body || {};
            let user = req.user || {};
            if (!user.id && !user.userId && !user.name) {
                const authHeader = req.headers?.authorization || req.headers?.Authorization;
                if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
                    const token = authHeader.slice(7).trim();
                    try {
                        const parts = token.split('.');
                        if (parts.length === 3) {
                            const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'));
                            user = {
                                id: decoded.sub || decoded.id || decoded.userId,
                                userId: decoded.sub || decoded.userId || decoded.id,
                                email: decoded.email,
                                role: decoded.role,
                                name: decoded.name,
                            };
                        }
                    }
                    catch {
                    }
                }
            }
            if (url.includes('/auth/login') && responseData) {
                const authUser = responseData.user || responseData.data;
                if (authUser) {
                    user = {
                        id: authUser.id || user.id,
                        userId: authUser.id || user.userId,
                        email: authUser.email || user.email || body.email,
                        role: authUser.role || user.role,
                        name: authUser.name || user.name,
                        picture: authUser.picture || user.picture,
                    };
                }
            }
            let resolvedUser = { ...user };
            const lookupId = user.id || user.userId;
            if (lookupId || user.email) {
                const dbUser = lookupId
                    ? await this.logsService.getUserById(lookupId)
                    : await this.logsService.getUserByEmail(user.email);
                if (dbUser) {
                    resolvedUser = {
                        ...resolvedUser,
                        id: dbUser.id,
                        userId: dbUser.id,
                        name: dbUser.name || resolvedUser.name || dbUser.email?.split('@')[0],
                        email: dbUser.email || resolvedUser.email,
                        role: dbUser.role || resolvedUser.role,
                        picture: dbUser.picture || resolvedUser.picture,
                    };
                }
            }
            let module = activity_log_entity_1.ActivityModule.SYSTEM;
            let action = activity_log_entity_1.ActivityAction.UPDATE;
            let description = `${method} request executed on ${url}`;
            if (url.includes('/auth/login')) {
                module = activity_log_entity_1.ActivityModule.AUTH;
                action = activity_log_entity_1.ActivityAction.LOGIN;
                const email = resolvedUser.email || body.email || 'User';
                description = `User ${email} authenticated into system dashboard`;
            }
            else if (url.includes('/payroll/disburse')) {
                module = activity_log_entity_1.ActivityModule.PAYROLL;
                action = activity_log_entity_1.ActivityAction.DISBURSE_PAYROLL;
                description = `Disbursed monthly employee payroll for period ${body.monthName || body.month || 'Current Month'}`;
            }
            else if (url.includes('/payroll/withdraw-executive')) {
                module = activity_log_entity_1.ActivityModule.FINANCE;
                action = activity_log_entity_1.ActivityAction.WITHDRAW_SHARE;
                description = `Processed executive leadership profit share withdrawal voucher ($${body.amount || 0})`;
            }
            else if (url.includes('/payroll')) {
                module = activity_log_entity_1.ActivityModule.PAYROLL;
                action = method === 'POST' ? activity_log_entity_1.ActivityAction.CREATE : activity_log_entity_1.ActivityAction.UPDATE;
                description = `Payroll records updated or generated for ${body.month || 'active cycle'}`;
            }
            else if (url.includes('/finance/settings')) {
                module = activity_log_entity_1.ActivityModule.FINANCE;
                action = activity_log_entity_1.ActivityAction.UPDATE_SETTINGS;
                description = `Updated corporate finance distribution ratios & profit share pool configuration`;
            }
            else if (url.includes('/finance/expense')) {
                module = activity_log_entity_1.ActivityModule.FINANCE;
                action = url.includes('/approve') ? activity_log_entity_1.ActivityAction.APPROVE_EXPENSE : activity_log_entity_1.ActivityAction.CREATE;
                description = `Expense voucher transaction: ${body.title || 'Operational Expense'} ($${body.amount || 0})`;
            }
            else if (url.includes('/finance')) {
                module = activity_log_entity_1.ActivityModule.FINANCE;
                action = method === 'DELETE' ? activity_log_entity_1.ActivityAction.DELETE : activity_log_entity_1.ActivityAction.UPDATE;
                description = `Financial record updated: ${url}`;
            }
            else if (url.includes('/users')) {
                module = activity_log_entity_1.ActivityModule.USERS;
                if (method === 'POST') {
                    action = activity_log_entity_1.ActivityAction.CREATE;
                    description = `Created/registered new user profile (${body.name || body.email || 'Member'})`;
                }
                else if (method === 'DELETE') {
                    action = activity_log_entity_1.ActivityAction.DELETE;
                    description = `Deleted user profile from registry`;
                }
                else {
                    action = activity_log_entity_1.ActivityAction.UPDATE;
                    description = `Updated user settings/profile for ${body.name || resolvedUser.email || 'Team Member'}`;
                }
            }
            else if (url.includes('/orders')) {
                module = activity_log_entity_1.ActivityModule.ORDERS;
                if (method === 'POST') {
                    action = activity_log_entity_1.ActivityAction.CREATE;
                    description = `Created new client order / project contract #${body.projectName || body.invoiceNumber || ''}`;
                }
                else if (method === 'DELETE') {
                    action = activity_log_entity_1.ActivityAction.DELETE;
                    description = `Removed order record from pipeline`;
                }
                else {
                    action = activity_log_entity_1.ActivityAction.UPDATE;
                    description = `Updated client order status / advance payment for ${body.projectName || 'project'}`;
                }
            }
            else if (url.includes('/blog')) {
                module = activity_log_entity_1.ActivityModule.BLOGS;
                action = method === 'POST' ? activity_log_entity_1.ActivityAction.CREATE : (method === 'DELETE' ? activity_log_entity_1.ActivityAction.DELETE : activity_log_entity_1.ActivityAction.UPDATE);
                description = `${action} blog publication (${body.title || 'Article'})`;
            }
            else if (url.includes('/casestudies')) {
                module = activity_log_entity_1.ActivityModule.CASE_STUDIES;
                action = method === 'POST' ? activity_log_entity_1.ActivityAction.CREATE : (method === 'DELETE' ? activity_log_entity_1.ActivityAction.DELETE : activity_log_entity_1.ActivityAction.UPDATE);
                description = `${action} case study showcase (${body.title || 'Case Study'})`;
            }
            else if (url.includes('/package-booking')) {
                module = activity_log_entity_1.ActivityModule.PACKAGES;
                if (method === 'POST') {
                    action = activity_log_entity_1.ActivityAction.CREATE;
                    description = `Client package booking request submitted by ${body.name || body.companyName || 'Client'}`;
                }
                else if (method === 'DELETE') {
                    action = activity_log_entity_1.ActivityAction.DELETE;
                    description = `Deleted package booking record`;
                }
                else {
                    action = activity_log_entity_1.ActivityAction.UPDATE;
                    description = `Updated package booking status`;
                }
            }
            else if (url.includes('/package')) {
                module = activity_log_entity_1.ActivityModule.PACKAGES;
                action = method === 'POST' ? activity_log_entity_1.ActivityAction.CREATE : (method === 'DELETE' ? activity_log_entity_1.ActivityAction.DELETE : activity_log_entity_1.ActivityAction.UPDATE);
                description = `${action} service package tier (${body.name || 'Package'})`;
            }
            else if (url.includes('/contact')) {
                module = activity_log_entity_1.ActivityModule.SYSTEM;
                action = method === 'POST' ? activity_log_entity_1.ActivityAction.CREATE : (method === 'DELETE' ? activity_log_entity_1.ActivityAction.DELETE : activity_log_entity_1.ActivityAction.UPDATE);
                description = `${action} contact inquiry from ${body.fullName || body.name || 'Visitor'}`;
            }
            const clientIp = req.headers?.['x-forwarded-for'] ||
                req.socket?.remoteAddress ||
                '127.0.0.1';
            const userAgent = req.headers?.['user-agent'] || 'Web Browser';
            let userName = resolvedUser.name || body.requestedByName || resolvedUser.email?.split('@')[0];
            if (!userName) {
                if (url.includes('/contact')) {
                    userName = body.fullName || body.name || 'Website Contact Lead';
                }
                else if (url.includes('/package-booking')) {
                    userName = body.name || body.companyName || 'Package Client Lead';
                }
                else {
                    userName = 'System Administrator';
                }
            }
            await this.logsService.create({
                userId: resolvedUser.id || resolvedUser.userId || null,
                userName,
                userEmail: resolvedUser.email || body.email || null,
                userRole: resolvedUser.role || (url.includes('/contact') || url.includes('/package-booking') ? 'client' : 'admin'),
                userPicture: resolvedUser.picture || null,
                action,
                module,
                description,
                ipAddress: String(clientIp).split(',')[0].trim(),
                userAgent: String(userAgent).slice(0, 300),
                status,
                details: body ? JSON.stringify({ path: url, method, bodySummary: Object.keys(body).slice(0, 6) }) : undefined,
            });
        }
        catch {
        }
    }
};
exports.ActivityLogInterceptor = ActivityLogInterceptor;
exports.ActivityLogInterceptor = ActivityLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [activity_logs_service_1.ActivityLogsService])
], ActivityLogInterceptor);
//# sourceMappingURL=activity-log.interceptor.js.map