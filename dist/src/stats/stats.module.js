"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const stats_service_1 = require("./stats.service");
const stats_controller_1 = require("./stats.controller");
const casestudy_entity_1 = require("../casestudies/entities/casestudy.entity");
const user_entity_1 = require("../users/entities/user.entity");
const partner_entity_1 = require("../partners/entities/partner.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const investor_capital_entity_1 = require("../finance/entities/investor-capital.entity");
const company_expense_entity_1 = require("../finance/entities/company-expense.entity");
const financial_setting_entity_1 = require("../finance/entities/financial-setting.entity");
const blog_entity_1 = require("../blog/entities/blog.entity");
const review_entity_1 = require("../review/entities/review.entity");
let StatsModule = class StatsModule {
};
exports.StatsModule = StatsModule;
exports.StatsModule = StatsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                casestudy_entity_1.Casestudy,
                user_entity_1.User,
                partner_entity_1.Partner,
                order_entity_1.Order,
                investor_capital_entity_1.InvestorCapital,
                company_expense_entity_1.CompanyExpense,
                financial_setting_entity_1.FinancialSetting,
                blog_entity_1.Blog,
                review_entity_1.Review,
            ]),
        ],
        controllers: [stats_controller_1.StatsController],
        providers: [stats_service_1.StatsService],
    })
], StatsModule);
//# sourceMappingURL=stats.module.js.map