"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCasestudyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_casestudy_dto_1 = require("./create-casestudy.dto");
class UpdateCasestudyDto extends (0, mapped_types_1.PartialType)(create_casestudy_dto_1.CreateCasestudyDto) {
}
exports.UpdateCasestudyDto = UpdateCasestudyDto;
//# sourceMappingURL=update-casestudy.dto.js.map