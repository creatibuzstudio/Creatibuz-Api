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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const casestudy_entity_1 = require("../casestudies/entities/casestudy.entity");
const user_entity_1 = require("../users/entities/user.entity");
const partner_entity_1 = require("../partners/entities/partner.entity");
let StatsService = class StatsService {
    casestudyRepository;
    userRepository;
    partnerRepository;
    constructor(casestudyRepository, userRepository, partnerRepository) {
        this.casestudyRepository = casestudyRepository;
        this.userRepository = userRepository;
        this.partnerRepository = partnerRepository;
    }
    async getStats() {
        const projectDeliveries = await this.casestudyRepository.count();
        const inHouseExperts = await this.userRepository.count();
        const businessPartners = await this.partnerRepository.count();
        return {
            projectDeliveries: Math.max(projectDeliveries, 50),
            inHouseExperts: Math.max(inHouseExperts, 15),
            satisfiedClients: 99,
            businessPartners: Math.max(businessPartners, 5),
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casestudy_entity_1.Casestudy)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(partner_entity_1.Partner)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map