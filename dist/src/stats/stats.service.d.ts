import { Repository } from 'typeorm';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { InvestorCapital } from '../finance/entities/investor-capital.entity';
import { CompanyExpense } from '../finance/entities/company-expense.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';
import { Blog } from '../blog/entities/blog.entity';
import { Review } from '../review/entities/review.entity';
export declare class StatsService {
    private casestudyRepository;
    private userRepository;
    private partnerRepository;
    private orderRepository;
    private capitalRepository;
    private expenseRepository;
    private settingRepository;
    private blogRepository;
    private reviewRepository;
    constructor(casestudyRepository: Repository<Casestudy>, userRepository: Repository<User>, partnerRepository: Repository<Partner>, orderRepository: Repository<Order>, capitalRepository: Repository<InvestorCapital>, expenseRepository: Repository<CompanyExpense>, settingRepository: Repository<FinancialSetting>, blogRepository: Repository<Blog>, reviewRepository: Repository<Review>);
    getStats(): Promise<{
        projectDeliveries: number;
        inHouseExperts: number;
        satisfiedClients: number;
        businessPartners: number;
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
            status: OrderStatus;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
            invoiceNumber: string;
            createdAt: Date;
        }[];
    }>;
}
