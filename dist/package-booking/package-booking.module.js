"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageBookingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const package_booking_service_1 = require("./package-booking.service");
const package_booking_controller_1 = require("./package-booking.controller");
const package_booking_entity_1 = require("./entities/package-booking.entity");
const user_entity_1 = require("../users/entities/user.entity");
let PackageBookingModule = class PackageBookingModule {
};
exports.PackageBookingModule = PackageBookingModule;
exports.PackageBookingModule = PackageBookingModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([package_booking_entity_1.PackageBooking, user_entity_1.User])],
        controllers: [package_booking_controller_1.PackageBookingController],
        providers: [package_booking_service_1.PackageBookingService],
    })
], PackageBookingModule);
//# sourceMappingURL=package-booking.module.js.map