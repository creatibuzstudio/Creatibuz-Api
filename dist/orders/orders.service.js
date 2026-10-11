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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./entities/order.entity");
const typeorm_2 = require("typeorm");
let OrdersService = class OrdersService {
    orderRepository;
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    async create(createOrderDto) {
        const orderData = {
            ...createOrderDto,
            client: createOrderDto.clientId ? { id: createOrderDto.clientId } : undefined,
            category: createOrderDto.categoryId ? { id: createOrderDto.categoryId } : undefined,
        };
        const advance = Number(createOrderDto.advance || 0);
        const budget = Number(createOrderDto.budget || 0);
        if (advance >= budget && budget > 0) {
            orderData.paymentStatus = order_entity_1.PaymentStatus.PAID;
        }
        else if (advance > 0) {
            orderData.paymentStatus = order_entity_1.PaymentStatus.PARTIAL;
        }
        else {
            orderData.paymentStatus = order_entity_1.PaymentStatus.UNPAID;
        }
        const order = this.orderRepository.create(orderData);
        return await this.orderRepository.save(order);
    }
    async findAll() {
        return await this.orderRepository.find({
            relations: {
                client: true,
                category: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findOneByClientId(clientId) {
        return await this.orderRepository.find({
            where: { client: { id: clientId } },
            relations: {
                client: true,
                category: true,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: {
                client: true,
                category: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        const updateData = { ...updateOrderDto };
        if (updateOrderDto.clientId) {
            updateData.client = { id: updateOrderDto.clientId };
        }
        if (updateOrderDto.categoryId) {
            updateData.category = { id: updateOrderDto.categoryId };
        }
        if (updateOrderDto.advance !== undefined) {
            updateData.advance = Number(order.advance) + Number(updateOrderDto.advance);
        }
        const currentAdvance = updateData.advance !== undefined ? updateData.advance : Number(order.advance);
        const currentBudget = updateData.budget !== undefined ? Number(updateData.budget) : Number(order.budget);
        if (currentAdvance >= currentBudget && currentBudget > 0) {
            updateData.paymentStatus = order_entity_1.PaymentStatus.PAID;
        }
        else if (currentAdvance > 0) {
            updateData.paymentStatus = order_entity_1.PaymentStatus.PARTIAL;
        }
        else {
            updateData.paymentStatus = order_entity_1.PaymentStatus.UNPAID;
        }
        Object.assign(order, updateData);
        return await this.orderRepository.save(order);
    }
    async remove(id) {
        const order = await this.findOne(id);
        await this.orderRepository.remove(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map