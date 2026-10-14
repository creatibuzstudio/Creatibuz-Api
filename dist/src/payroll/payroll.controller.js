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
exports.PayrollController = void 0;
const common_1 = require("@nestjs/common");
const payroll_service_1 = require("./payroll.service");
const generate_payroll_dto_1 = require("./dto/generate-payroll.dto");
const disburse_payroll_dto_1 = require("./dto/disburse-payroll.dto");
const withdraw_executive_dto_1 = require("./dto/withdraw-executive.dto");
let PayrollController = class PayrollController {
    constructor(payrollService) {
        this.payrollService = payrollService;
    }
    async getMonthlySummary(month) {
        return await this.payrollService.getMonthlySummary(month);
    }
    async generateOrUpdatePayroll(dto) {
        return await this.payrollService.generateOrUpdatePayroll(dto);
    }
    async withdrawExecutive(dto) {
        return await this.payrollService.withdrawExecutiveShare(dto);
    }
    async disbursePayroll(dto) {
        return await this.payrollService.disburseEmployeePayroll(dto);
    }
    async getPayrollHistory() {
        return await this.payrollService.getPayrollHistory();
    }
    async getPayslip(id) {
        return await this.payrollService.getPayslip(id);
    }
};
exports.PayrollController = PayrollController;
__decorate([
    (0, common_1.Get)('summary'),
    __param(0, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getMonthlySummary", null);
__decorate([
    (0, common_1.Post)('generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_payroll_dto_1.GeneratePayrollDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "generateOrUpdatePayroll", null);
__decorate([
    (0, common_1.Post)('withdraw-executive'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [withdraw_executive_dto_1.WithdrawExecutiveDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "withdrawExecutive", null);
__decorate([
    (0, common_1.Post)('disburse'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [disburse_payroll_dto_1.DisbursePayrollDto]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "disbursePayroll", null);
__decorate([
    (0, common_1.Get)('history'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayrollHistory", null);
__decorate([
    (0, common_1.Get)('item/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PayrollController.prototype, "getPayslip", null);
exports.PayrollController = PayrollController = __decorate([
    (0, common_1.Controller)('payroll'),
    __metadata("design:paramtypes", [payroll_service_1.PayrollService])
], PayrollController);
//# sourceMappingURL=payroll.controller.js.map