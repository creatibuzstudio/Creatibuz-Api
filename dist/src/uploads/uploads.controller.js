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
exports.UploadsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
let UploadsController = class UploadsController {
    async uploadFile(file) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        try {
            const body = new URLSearchParams();
            body.append('key', '76ffca68cd9c73caf76e6515c27a27b5');
            body.append('image', file.buffer.toString('base64'));
            const response = await fetch('https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: body,
            });
            const result = await response.json();
            if (result.success) {
                return {
                    message: 'Image uploaded successfully',
                    url: result.data.url,
                    filename: file.originalname,
                };
            }
            else {
                throw new common_1.BadRequestException('Image upload to ImgBB failed');
            }
        }
        catch (error) {
            throw new common_1.BadRequestException('Image upload failed: ' + error.message);
        }
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
                return callback(new common_1.BadRequestException('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UploadsController.prototype, "uploadFile", null);
exports.UploadsController = UploadsController = __decorate([
    (0, common_1.Controller)('uploads')
], UploadsController);
//# sourceMappingURL=uploads.controller.js.map