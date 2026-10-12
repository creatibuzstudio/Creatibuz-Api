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
exports.PackageBookingController = void 0;
const common_1 = require("@nestjs/common");
const package_booking_service_1 = require("./package-booking.service");
const create_package_booking_dto_1 = require("./dto/create-package-booking.dto");
const update_package_booking_dto_1 = require("./dto/update-package-booking.dto");
let PackageBookingController = class PackageBookingController {
    constructor(packageBookingService) {
        this.packageBookingService = packageBookingService;
    }
    async create(createPackageBookingDto) {
        const data = await this.packageBookingService.create(createPackageBookingDto);
        return {
            statusCode: common_1.HttpStatus.CREATED,
            message: 'Package booking request submitted successfully',
            data,
        };
    }
    async findAll() {
        const data = await this.packageBookingService.findAll();
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Package bookings retrieved successfully',
            data,
        };
    }
    async findOne(id) {
        const data = await this.packageBookingService.findOne(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Package booking retrieved successfully',
            data,
        };
    }
    async update(id, updatePackageBookingDto) {
        const data = await this.packageBookingService.update(id, updatePackageBookingDto);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Package booking updated successfully',
            data,
        };
    }
    async remove(id) {
        await this.packageBookingService.remove(id);
        return {
            statusCode: common_1.HttpStatus.OK,
            message: 'Package booking deleted successfully',
            data: null,
        };
    }
};
exports.PackageBookingController = PackageBookingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_package_booking_dto_1.CreatePackageBookingDto]),
    __metadata("design:returntype", Promise)
], PackageBookingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PackageBookingController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackageBookingController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_package_booking_dto_1.UpdatePackageBookingDto]),
    __metadata("design:returntype", Promise)
], PackageBookingController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PackageBookingController.prototype, "remove", null);
exports.PackageBookingController = PackageBookingController = __decorate([
    (0, common_1.Controller)('package-booking'),
    __metadata("design:paramtypes", [package_booking_service_1.PackageBookingService])
], PackageBookingController);
//# sourceMappingURL=package-booking.controller.js.map