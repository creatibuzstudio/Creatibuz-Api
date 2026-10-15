"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeTrackerModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const time_log_entity_1 = require("./entities/time-log.entity");
const user_entity_1 = require("../users/entities/user.entity");
const time_tracker_service_1 = require("./time-tracker.service");
const time_tracker_controller_1 = require("./time-tracker.controller");
let TimeTrackerModule = class TimeTrackerModule {
};
exports.TimeTrackerModule = TimeTrackerModule;
exports.TimeTrackerModule = TimeTrackerModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([time_log_entity_1.TimeLog, user_entity_1.User])],
        controllers: [time_tracker_controller_1.TimeTrackerController],
        providers: [time_tracker_service_1.TimeTrackerService],
        exports: [time_tracker_service_1.TimeTrackerService],
    })
], TimeTrackerModule);
//# sourceMappingURL=time-tracker.module.js.map