"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const designation_module_1 = require("./designation/designation.module");
const department_module_1 = require("./department/department.module");
const auth_module_1 = require("./auth/auth.module");
const partners_module_1 = require("./partners/partners.module");
const package_module_1 = require("./package/package.module");
const package_booking_module_1 = require("./package-booking/package-booking.module");
const banner_module_1 = require("./banner/banner.module");
const casestudies_module_1 = require("./casestudies/casestudies.module");
const category_module_1 = require("./category/category.module");
const orders_module_1 = require("./orders/orders.module");
const package_category_module_1 = require("./package-category/package-category.module");
const package_title_module_1 = require("./package-title/package-title.module");
const blog_module_1 = require("./blog/blog.module");
const review_module_1 = require("./review/review.module");
const contact_module_1 = require("./contact/contact.module");
const stats_module_1 = require("./stats/stats.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const uploads_module_1 = require("./uploads/uploads.module");
const finance_module_1 = require("./finance/finance.module");
const payroll_module_1 = require("./payroll/payroll.module");
const activity_logs_module_1 = require("./activity-logs/activity-logs.module");
const time_tracker_module_1 = require("./time-tracker/time-tracker.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    url: configService.get('DATABASE_URL'),
                    autoLoadEntities: true,
                    synchronize: false,
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            designation_module_1.DesignationModule,
            department_module_1.DepartmentModule,
            auth_module_1.AuthModule,
            partners_module_1.PartnersModule,
            package_module_1.PackageModule,
            package_booking_module_1.PackageBookingModule,
            banner_module_1.BannerModule,
            casestudies_module_1.CasestudiesModule,
            category_module_1.CategoryModule,
            orders_module_1.OrdersModule,
            package_category_module_1.PackageCategoryModule,
            package_title_module_1.PackageTitleModule,
            blog_module_1.BlogModule,
            review_module_1.ReviewModule,
            contact_module_1.ContactModule,
            stats_module_1.StatsModule,
            uploads_module_1.UploadsModule,
            finance_module_1.FinanceModule,
            payroll_module_1.PayrollModule,
            activity_logs_module_1.ActivityLogsModule,
            time_tracker_module_1.TimeTrackerModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/cdn/',
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map