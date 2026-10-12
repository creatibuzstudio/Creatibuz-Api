"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePackageBookingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_package_booking_dto_1 = require("./create-package-booking.dto");
class UpdatePackageBookingDto extends (0, mapped_types_1.PartialType)(create_package_booking_dto_1.CreatePackageBookingDto) {
}
exports.UpdatePackageBookingDto = UpdatePackageBookingDto;
//# sourceMappingURL=update-package-booking.dto.js.map