import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly statsService;
    constructor(statsService: StatsService);
    getStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
        totalWebsiteVisitors: number;
        todayWebsiteVisitors: number;
        totalBlogReaders: number;
        todayBlogVisitors: number;
        uniqueVisitorsCount: number;
        topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
        visitorTrend: {
            date: string;
            day: string;
            websiteVisitors: number;
            blogVisitors: number;
        }[];
        overview: {
            totalRevenue: number;
            totalInvoiced: number;
            totalDue: number;
            totalTreasury: number;
            totalInvestorCapital: number;
            totalApprovedExpenses: number;
            pendingExpensesAmount: number;
            pendingExpensesCount: number;
            totalOrders: number;
            completedOrders: number;
            ongoingOrders: number;
            qaOrders: number;
            deliveryOrders: number;
            onboardOrders: number;
            totalUsers: number;
            totalClients: number;
            totalEmployees: number;
            totalExecutives: number;
            totalBlogs: number;
            totalCaseStudies: number;
            businessPartners: number;
            totalReviews: number;
            totalWebsiteVisitors: number;
            todayWebsiteVisitors: number;
            totalBlogReaders: number;
            todayBlogVisitors: number;
            uniqueVisitorsCount: number;
            topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
            pools: {
                companyCost: {
                    percent: number;
                    allocated: number;
                    spent: number;
                    remaining: number;
                };
                employeePool: {
                    percent: number;
                    allocated: number;
                };
                leadershipPool: {
                    percent: number;
                    allocated: number;
                    ceoPercent: number;
                    cooPercent: number;
                    ceoAmount: number;
                    cooAmount: number;
                };
            };
        };
        charts: {
            revenueTrend: {
                name: string;
                revenue: number;
                invoiced: number;
                orders: number;
            }[];
            orderStatusDistribution: {
                name: string;
                value: number;
                color: string;
            }[];
            profitDistribution: {
                name: string;
                percent: number;
                amount: number;
                color: string;
            }[];
            visitorTrend: {
                date: string;
                day: string;
                websiteVisitors: number;
                blogVisitors: number;
            }[];
        };
        recentOrders: {
            id: string;
            projectName: string;
            clientName: string;
            clientEmail: string;
            clientPicture: string;
            budget: number;
            advance: number;
            due: number;
            status: import("../orders/entities/order.entity").OrderStatus;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
            invoiceNumber: string;
            createdAt: Date;
        }[];
        runningMonthName: string;
        upcomingBirthdays: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            dateOfBirth: string;
            formattedDate: string;
            birthDay: number;
            diffDays: number;
            statusText: string;
            isToday: boolean;
            isPast: boolean;
        }[];
        newJoiners: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            joiningDate: string | Date;
            createdAt: Date;
            formattedDate: string;
            exactTime: string;
            fullDateTime: string;
            daysAgo: number;
            relativeTime: string;
            isNew: boolean;
        }[];
    }>;
    getDashboardStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
        totalWebsiteVisitors: number;
        todayWebsiteVisitors: number;
        totalBlogReaders: number;
        todayBlogVisitors: number;
        uniqueVisitorsCount: number;
        topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
        visitorTrend: {
            date: string;
            day: string;
            websiteVisitors: number;
            blogVisitors: number;
        }[];
        overview: {
            totalRevenue: number;
            totalInvoiced: number;
            totalDue: number;
            totalTreasury: number;
            totalInvestorCapital: number;
            totalApprovedExpenses: number;
            pendingExpensesAmount: number;
            pendingExpensesCount: number;
            totalOrders: number;
            completedOrders: number;
            ongoingOrders: number;
            qaOrders: number;
            deliveryOrders: number;
            onboardOrders: number;
            totalUsers: number;
            totalClients: number;
            totalEmployees: number;
            totalExecutives: number;
            totalBlogs: number;
            totalCaseStudies: number;
            businessPartners: number;
            totalReviews: number;
            totalWebsiteVisitors: number;
            todayWebsiteVisitors: number;
            totalBlogReaders: number;
            todayBlogVisitors: number;
            uniqueVisitorsCount: number;
            topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
            pools: {
                companyCost: {
                    percent: number;
                    allocated: number;
                    spent: number;
                    remaining: number;
                };
                employeePool: {
                    percent: number;
                    allocated: number;
                };
                leadershipPool: {
                    percent: number;
                    allocated: number;
                    ceoPercent: number;
                    cooPercent: number;
                    ceoAmount: number;
                    cooAmount: number;
                };
            };
        };
        charts: {
            revenueTrend: {
                name: string;
                revenue: number;
                invoiced: number;
                orders: number;
            }[];
            orderStatusDistribution: {
                name: string;
                value: number;
                color: string;
            }[];
            profitDistribution: {
                name: string;
                percent: number;
                amount: number;
                color: string;
            }[];
            visitorTrend: {
                date: string;
                day: string;
                websiteVisitors: number;
                blogVisitors: number;
            }[];
        };
        recentOrders: {
            id: string;
            projectName: string;
            clientName: string;
            clientEmail: string;
            clientPicture: string;
            budget: number;
            advance: number;
            due: number;
            status: import("../orders/entities/order.entity").OrderStatus;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
            invoiceNumber: string;
            createdAt: Date;
        }[];
        runningMonthName: string;
        upcomingBirthdays: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            dateOfBirth: string;
            formattedDate: string;
            birthDay: number;
            diffDays: number;
            statusText: string;
            isToday: boolean;
            isPast: boolean;
        }[];
        newJoiners: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            joiningDate: string | Date;
            createdAt: Date;
            formattedDate: string;
            exactTime: string;
            fullDateTime: string;
            daysAgo: number;
            relativeTime: string;
            isNew: boolean;
        }[];
    }>;
    getOverviewStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
        totalWebsiteVisitors: number;
        todayWebsiteVisitors: number;
        totalBlogReaders: number;
        todayBlogVisitors: number;
        uniqueVisitorsCount: number;
        topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
        visitorTrend: {
            date: string;
            day: string;
            websiteVisitors: number;
            blogVisitors: number;
        }[];
        overview: {
            totalRevenue: number;
            totalInvoiced: number;
            totalDue: number;
            totalTreasury: number;
            totalInvestorCapital: number;
            totalApprovedExpenses: number;
            pendingExpensesAmount: number;
            pendingExpensesCount: number;
            totalOrders: number;
            completedOrders: number;
            ongoingOrders: number;
            qaOrders: number;
            deliveryOrders: number;
            onboardOrders: number;
            totalUsers: number;
            totalClients: number;
            totalEmployees: number;
            totalExecutives: number;
            totalBlogs: number;
            totalCaseStudies: number;
            businessPartners: number;
            totalReviews: number;
            totalWebsiteVisitors: number;
            todayWebsiteVisitors: number;
            totalBlogReaders: number;
            todayBlogVisitors: number;
            uniqueVisitorsCount: number;
            topViewedBlogs: import("../blog/entities/blog.entity").Blog[];
            pools: {
                companyCost: {
                    percent: number;
                    allocated: number;
                    spent: number;
                    remaining: number;
                };
                employeePool: {
                    percent: number;
                    allocated: number;
                };
                leadershipPool: {
                    percent: number;
                    allocated: number;
                    ceoPercent: number;
                    cooPercent: number;
                    ceoAmount: number;
                    cooAmount: number;
                };
            };
        };
        charts: {
            revenueTrend: {
                name: string;
                revenue: number;
                invoiced: number;
                orders: number;
            }[];
            orderStatusDistribution: {
                name: string;
                value: number;
                color: string;
            }[];
            profitDistribution: {
                name: string;
                percent: number;
                amount: number;
                color: string;
            }[];
            visitorTrend: {
                date: string;
                day: string;
                websiteVisitors: number;
                blogVisitors: number;
            }[];
        };
        recentOrders: {
            id: string;
            projectName: string;
            clientName: string;
            clientEmail: string;
            clientPicture: string;
            budget: number;
            advance: number;
            due: number;
            status: import("../orders/entities/order.entity").OrderStatus;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
            invoiceNumber: string;
            createdAt: Date;
        }[];
        runningMonthName: string;
        upcomingBirthdays: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            dateOfBirth: string;
            formattedDate: string;
            birthDay: number;
            diffDays: number;
            statusText: string;
            isToday: boolean;
            isPast: boolean;
        }[];
        newJoiners: {
            id: string;
            name: string;
            email: string;
            picture: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            designation: string;
            joiningDate: string | Date;
            createdAt: Date;
            formattedDate: string;
            exactTime: string;
            fullDateTime: string;
            daysAgo: number;
            relativeTime: string;
            isNew: boolean;
        }[];
    }>;
    trackVisit(req: any, body: {
        path?: string;
        eventType?: string;
        blogSlug?: string;
    }): Promise<{
        success: boolean;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
    }>;
}
