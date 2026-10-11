import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
    }>;
}
