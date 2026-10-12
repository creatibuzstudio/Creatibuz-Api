"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePackageCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_package_category_dto_1 = require("./create-package-category.dto");
class UpdatePackageCategoryDto extends (0, mapped_types_1.PartialType)(create_package_category_dto_1.CreatePackageCategoryDto) {
}
exports.UpdatePackageCategoryDto = UpdatePackageCategoryDto;
//# sourceMappingURL=update-package-category.dto.js.map