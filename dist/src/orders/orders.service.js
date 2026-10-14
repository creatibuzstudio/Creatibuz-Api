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
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        return `INV-${year}-${random}`;
    }
    generateReceiptNumber() {
        const year = new Date().getFullYear();
        const random = Math.floor(100000 + Math.random() * 900000);
        return `REC-${year}-${random}`;
    }
    async create(createOrderDto) {
        const subtotal = createOrderDto.subtotal !== undefined
            ? Number(createOrderDto.subtotal)
            : Number(createOrderDto.budget || 0);
        const discount = Number(createOrderDto.discount || 0);
        const tax = Number(createOrderDto.tax || 0);
        const budget = createOrderDto.budget !== undefined
            ? Number(createOrderDto.budget)
            : Math.max(0, subtotal - discount + tax);
        const isPaid = createOrderDto.paymentStatus &&
            String(createOrderDto.paymentStatus).toLowerCase() === order_entity_1.PaymentStatus.PAID;
        let advance = Number(createOrderDto.advance || 0);
        if (isPaid && advance < budget) {
            advance = budget;
        }
        const initialPayments = Array.isArray(createOrderDto.payments) && createOrderDto.payments.length > 0
            ? createOrderDto.payments
            : advance > 0
                ? [
                    {
                        id: `pmt-${Date.now()}`,
                        amount: advance,
                        paymentDate: new Date().toISOString().split('T')[0],
                        paymentMethod: isPaid ? 'Full Payment' : 'Initial Advance',
                        receiptNumber: this.generateReceiptNumber(),
                        note: isPaid
                            ? 'Full payment received upon order creation'
                            : 'Initial payment upon order onboarding',
                        createdAt: new Date().toISOString(),
                    },
                ]
                : [];
        const orderData = {
            ...createOrderDto,
            subtotal,
            budget,
            advance,
            discount,
            tax,
            payments: initialPayments,
            invoiceNumber: createOrderDto.invoiceNumber || this.generateInvoiceNumber(),
            client: createOrderDto.clientId ? { id: createOrderDto.clientId } : undefined,
            category: createOrderDto.categoryId ? { id: createOrderDto.categoryId } : undefined,
        };
        if (createOrderDto.paymentStatus) {
            orderData.paymentStatus = createOrderDto.paymentStatus;
            if (isPaid) {
                orderData.advance = Math.max(budget, advance);
            }
        }
        else if (advance >= budget && budget > 0) {
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
    async findAll(options) {
        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.category', 'category')
            .orderBy('order.createdAt', 'DESC');
        if (options?.query) {
            const q = `%${options.query.trim().toLowerCase()}%`;
            queryBuilder.andWhere('(LOWER(order.projectName) LIKE :q OR LOWER(order.invoiceNumber) LIKE :q OR LOWER(order.clientName) LIKE :q OR LOWER(client.name) LIKE :q OR LOWER(client.email) LIKE :q)', { q });
        }
        if (options?.status) {
            queryBuilder.andWhere('order.status = :status', { status: options.status });
        }
        if (options?.paymentStatus) {
            queryBuilder.andWhere('order.paymentStatus = :paymentStatus', {
                paymentStatus: options.paymentStatus,
            });
        }
        if (options?.clientId) {
            queryBuilder.andWhere('client.id = :clientId', { clientId: options.clientId });
        }
        return await queryBuilder.getMany();
    }
    async findOneByClientId(clientId) {
        return await this.findAll({ clientId });
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
    async findByInvoiceNumber(invoiceNumber) {
        const order = await this.orderRepository.findOne({
            where: { invoiceNumber },
            relations: {
                client: true,
                category: true,
            },
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with invoice ${invoiceNumber} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const order = await this.findOne(id);
        const updateData = { ...updateOrderDto };
        if (updateOrderDto.clientId !== undefined) {
            updateData.client = updateOrderDto.clientId ? { id: updateOrderDto.clientId } : null;
        }
        if (updateOrderDto.categoryId !== undefined) {
            updateData.category = updateOrderDto.categoryId ? { id: updateOrderDto.categoryId } : null;
        }
        if (updateOrderDto.subtotal !== undefined) {
            updateData.subtotal = Number(updateOrderDto.subtotal);
        }
        if (updateOrderDto.discount !== undefined) {
            updateData.discount = Number(updateOrderDto.discount);
        }
        if (updateOrderDto.tax !== undefined) {
            updateData.tax = Number(updateOrderDto.tax);
        }
        if (updateOrderDto.advance !== undefined) {
            updateData.advance = Number(updateOrderDto.advance);
        }
        const currentSubtotal = updateData.subtotal !== undefined ? Number(updateData.subtotal) : Number(order.subtotal || order.budget || 0);
        const currentDiscount = updateData.discount !== undefined ? Number(updateData.discount) : Number(order.discount || 0);
        const currentTax = updateData.tax !== undefined ? Number(updateData.tax) : Number(order.tax || 0);
        if (updateOrderDto.budget !== undefined) {
            updateData.budget = Number(updateOrderDto.budget);
        }
        else if (updateOrderDto.subtotal !== undefined ||
            updateOrderDto.discount !== undefined ||
            updateOrderDto.tax !== undefined) {
            updateData.budget = Math.max(0, currentSubtotal - currentDiscount + currentTax);
        }
        const currentAdvance = updateData.advance !== undefined ? Number(updateData.advance) : Number(order.advance || 0);
        const currentBudget = updateData.budget !== undefined ? Number(updateData.budget) : Number(order.budget || 0);
        if (updateOrderDto.paymentStatus) {
            updateData.paymentStatus = updateOrderDto.paymentStatus;
            if (String(updateOrderDto.paymentStatus).toLowerCase() === order_entity_1.PaymentStatus.PAID) {
                if (updateData.advance === undefined || Number(updateData.advance) < currentBudget) {
                    updateData.advance = currentBudget;
                }
                const existingPayments = Array.isArray(order.payments) ? order.payments : [];
                const currentPaid = existingPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
                if (currentPaid < currentBudget) {
                    const settlementAmount = currentBudget - currentPaid;
                    const settlementPayment = {
                        id: `pmt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
                        amount: settlementAmount,
                        paymentDate: new Date().toISOString().split('T')[0],
                        paymentMethod: 'Settlement Payment',
                        receiptNumber: this.generateReceiptNumber(),
                        note: 'Order marked as paid in full',
                        createdAt: new Date().toISOString(),
                    };
                    updateData.payments = [...existingPayments, settlementPayment];
                }
            }
        }
        else if (currentAdvance >= currentBudget && currentBudget > 0) {
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
    async addPayment(id, recordPaymentDto) {
        const order = await this.findOne(id);
        const receiptNumber = recordPaymentDto.receiptNumber || this.generateReceiptNumber();
        const newPayment = {
            id: `pmt-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
            amount: Number(recordPaymentDto.amount),
            paymentDate: recordPaymentDto.paymentDate || new Date().toISOString().split('T')[0],
            paymentMethod: recordPaymentDto.paymentMethod || 'Bank Transfer',
            transactionId: recordPaymentDto.transactionId || undefined,
            receiptNumber,
            note: recordPaymentDto.note || undefined,
            createdAt: new Date().toISOString(),
        };
        const existingPayments = Array.isArray(order.payments) ? order.payments : [];
        order.payments = [...existingPayments, newPayment];
        order.advance = Number(order.advance || 0) + Number(recordPaymentDto.amount);
        const total = Number(order.budget || 0);
        if (order.advance >= total && total > 0) {
            order.paymentStatus = order_entity_1.PaymentStatus.PAID;
        }
        else if (order.advance > 0) {
            order.paymentStatus = order_entity_1.PaymentStatus.PARTIAL;
        }
        else {
            order.paymentStatus = order_entity_1.PaymentStatus.UNPAID;
        }
        const savedOrder = await this.orderRepository.save(order);
        return { order: savedOrder, payment: newPayment };
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