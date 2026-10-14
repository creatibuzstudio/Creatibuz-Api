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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const record_payment_dto_1 = require("./dto/record-payment.dto");
let OrdersController = class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    async create(createOrderDto) {
        const data = await this.ordersService.create(createOrderDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Order created successfully',
            data,
        };
    }
    async recordPayment(id, recordPaymentDto) {
        const data = await this.ordersService.addPayment(id, recordPaymentDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Payment recorded and receipt created successfully',
            data,
        };
    }
    async findAll(query) {
        const data = await this.ordersService.findAll(query);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Orders retrieved successfully',
            data,
        };
    }
    async findByInvoiceNumber(invoiceNumber) {
        const data = await this.ordersService.findByInvoiceNumber(invoiceNumber);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order invoice retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.ordersService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order retrieved successfully',
            data,
        };
    }
    async findOneByClientId(clientId) {
        const data = await this.ordersService.findOneByClientId(clientId);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Orders retrieved successfully',
            data,
        };
    }
    async update(id, updateOrderDto) {
        const data = await this.ordersService.update(id, updateOrderDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.ordersService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Order removed successfully',
        };
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/payment'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, record_payment_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('invoice/:invoiceNumber'),
    __param(0, (0, common_1.Param)('invoiceNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findByInvoiceNumber", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('client/:clientId'),
    __param(0, (0, common_1.Param)('clientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOneByClientId", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "remove", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map