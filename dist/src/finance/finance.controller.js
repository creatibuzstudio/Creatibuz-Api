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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_capital_dto_1 = require("./dto/create-capital.dto");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const update_settings_dto_1 = require("./dto/update-settings.dto");
const approve_expense_dto_1 = require("./dto/approve-expense.dto");
const company_expense_entity_1 = require("./entities/company-expense.entity");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    async getOverview() {
        const data = await this.financeService.getOverview();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Financial overview and distribution retrieved successfully',
            data,
        };
    }
    async getSettings() {
        const data = await this.financeService.getSettings();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Financial distribution settings retrieved successfully',
            data,
        };
    }
    async updateSettings(dto) {
        const data = await this.financeService.updateSettings(dto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Financial distribution settings updated successfully',
            data,
        };
    }
    async getExecutives() {
        const data = await this.financeService.getExecutiveUsers();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Executive users (CEO & COO) retrieved successfully',
            data,
        };
    }
    async findAllCapitals() {
        const data = await this.financeService.findAllCapitals();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor capital records retrieved successfully',
            data,
        };
    }
    async createCapital(dto) {
        const data = await this.financeService.createCapital(dto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Investor capital recorded successfully',
            data,
        };
    }
    async deleteCapital(id) {
        await this.financeService.deleteCapital(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Investor capital removed successfully',
        };
    }
    async findAllExpenses(status) {
        const data = await this.financeService.findAllExpenses(status);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Company expenses retrieved successfully',
            data,
        };
    }
    async findOneExpense(id) {
        const data = await this.financeService.findOneExpense(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Company expense details retrieved successfully',
            data,
        };
    }
    async createExpense(dto) {
        const data = await this.financeService.createExpense(dto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Company expense requested successfully',
            data,
        };
    }
    async approveExpense(id, dto) {
        const data = await this.financeService.approveExpense(id, dto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Expense approval status updated successfully',
            data,
        };
    }
    async deleteExpense(id) {
        await this.financeService.deleteExpense(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Company expense removed successfully',
        };
    }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Get)('overview'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getOverview", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_settings_dto_1.UpdateSettingsDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Get)('executives'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getExecutives", null);
__decorate([
    (0, common_1.Get)('capitals'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findAllCapitals", null);
__decorate([
    (0, common_1.Post)('capitals'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_capital_dto_1.CreateCapitalDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createCapital", null);
__decorate([
    (0, common_1.Delete)('capitals/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "deleteCapital", null);
__decorate([
    (0, common_1.Get)('expenses'),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findAllExpenses", null);
__decorate([
    (0, common_1.Get)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findOneExpense", null);
__decorate([
    (0, common_1.Post)('expenses'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Patch)('expenses/:id/approve'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approve_expense_dto_1.ApproveExpenseDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "approveExpense", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "deleteExpense", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)('finance'),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map