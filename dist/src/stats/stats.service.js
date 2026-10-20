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
const order_entity_1 = require("../orders/entities/order.entity");
const investor_capital_entity_1 = require("../finance/entities/investor-capital.entity");
const company_expense_entity_1 = require("../finance/entities/company-expense.entity");
const financial_setting_entity_1 = require("../finance/entities/financial-setting.entity");
const blog_entity_1 = require("../blog/entities/blog.entity");
const review_entity_1 = require("../review/entities/review.entity");
const visitor_entity_1 = require("./entities/visitor.entity");
let StatsService = class StatsService {
    constructor(casestudyRepository, userRepository, partnerRepository, orderRepository, capitalRepository, expenseRepository, settingRepository, blogRepository, reviewRepository, visitorRepository) {
        this.casestudyRepository = casestudyRepository;
        this.userRepository = userRepository;
        this.partnerRepository = partnerRepository;
        this.orderRepository = orderRepository;
        this.capitalRepository = capitalRepository;
        this.expenseRepository = expenseRepository;
        this.settingRepository = settingRepository;
        this.blogRepository = blogRepository;
        this.reviewRepository = reviewRepository;
        this.visitorRepository = visitorRepository;
    }
    async trackVisit(data) {
        try {
            const visitor = this.visitorRepository.create({
                ipAddress: data.ipAddress || '127.0.0.1',
                userAgent: data.userAgent ? String(data.userAgent).slice(0, 300) : 'Web Browser',
                pagePath: data.pagePath || '/',
                eventType: data.eventType || (data.blogSlug ? 'BLOG_VIEW' : 'PAGE_VIEW'),
                blogSlug: data.blogSlug || null,
            });
            await this.visitorRepository.save(visitor);
            if (data.blogSlug) {
                await this.blogRepository.increment({ slug: data.blogSlug }, 'views', 1);
            }
            return { success: true };
        }
        catch (error) {
            return { success: false, error: error?.message || 'Failed to record visit' };
        }
    }
    async getStats() {
        const projectDeliveries = await this.casestudyRepository.count();
        const allUsers = await this.userRepository.find({
            relations: { designation: true, department: true },
        });
        const inHouseExperts = allUsers.filter((u) => u.role !== user_entity_1.UserRole.CLIENT).length;
        const totalClients = allUsers.filter((u) => u.role === user_entity_1.UserRole.CLIENT).length;
        const totalExecutives = allUsers.filter((u) => u.role?.toLowerCase() === 'ceo' || u.role?.toLowerCase() === 'coo').length;
        const businessPartners = await this.partnerRepository.count();
        const totalBlogs = await this.blogRepository.count();
        const totalReviews = await this.reviewRepository.count();
        const orders = await this.orderRepository.find({
            relations: { client: true, category: true },
            order: { createdAt: 'DESC' },
        });
        let totalRevenue = 0;
        let totalInvoiced = 0;
        let completedOrders = 0;
        let ongoingOrders = 0;
        let qaOrders = 0;
        let onboardOrders = 0;
        let deliveryOrders = 0;
        orders.forEach((o) => {
            const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
            const disc = Number(o.discount || 0);
            const tx = Number(o.tax || 0);
            const orderInvoiced = Math.max(0, sub - disc + tx) || Number(o.budget || 0);
            const adv = Number(o.advance || 0);
            const pmtSum = Array.isArray(o.payments)
                ? o.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                : 0;
            const pStatus = String(o.paymentStatus || '').toLowerCase();
            const orderPaid = pStatus === 'paid'
                ? Math.max(orderInvoiced, adv, pmtSum)
                : Math.max(adv, pmtSum);
            totalRevenue += orderPaid;
            totalInvoiced += orderInvoiced;
            const st = String(o.status || '').toLowerCase();
            if (st === order_entity_1.OrderStatus.DELIVERED || st === 'delivered') {
                completedOrders += 1;
            }
            else if (st === order_entity_1.OrderStatus.ONGOING || st === 'ongoing') {
                ongoingOrders += 1;
            }
            else if (st === order_entity_1.OrderStatus.QA_TEST || st === 'qa test') {
                qaOrders += 1;
            }
            else if (st === order_entity_1.OrderStatus.DELIVERY || st === 'delivery') {
                deliveryOrders += 1;
            }
            else {
                onboardOrders += 1;
            }
        });
        const totalDue = Math.max(0, totalInvoiced - totalRevenue);
        const capitals = await this.capitalRepository.find();
        let totalInvestorCapital = 0;
        capitals.forEach((c) => {
            totalInvestorCapital += Number(c.amount || 0);
        });
        const expenses = await this.expenseRepository.find();
        let totalApprovedExpenses = 0;
        let pendingExpensesAmount = 0;
        let pendingExpensesCount = 0;
        expenses.forEach((e) => {
            const amt = Number(e.amount || 0);
            if (e.status === company_expense_entity_1.ExpenseStatus.APPROVED) {
                totalApprovedExpenses += amt;
            }
            else if (e.status === company_expense_entity_1.ExpenseStatus.PENDING ||
                e.status === company_expense_entity_1.ExpenseStatus.CEO_APPROVED ||
                e.status === company_expense_entity_1.ExpenseStatus.COO_APPROVED) {
                pendingExpensesAmount += amt;
                pendingExpensesCount += 1;
            }
        });
        const totalTreasury = totalInvestorCapital + totalRevenue - totalApprovedExpenses;
        const settings = await this.settingRepository.find({
            order: { createdAt: 'ASC' },
            take: 1,
        });
        let setting = settings[0] || null;
        const companyCostPercent = Number(setting?.companyCostPercent || 40);
        const employeePoolPercent = Number(setting?.employeePoolPercent || 30);
        const leadershipPoolPercent = Number(setting?.leadershipPoolPercent || 30);
        const ceoPercent = setting?.ceoPercent !== undefined && setting?.ceoPercent !== null
            ? Number(setting.ceoPercent)
            : Number((leadershipPoolPercent * (Number(setting?.ceoShareRatio || 60) / 100)).toFixed(1));
        const cooPercent = setting?.cooPercent !== undefined && setting?.cooPercent !== null
            ? Number(setting.cooPercent)
            : Number((leadershipPoolPercent * (Number(setting?.cooShareRatio || 40) / 100)).toFixed(1));
        const companyCostAllocated = totalRevenue * (companyCostPercent / 100);
        const employeePoolAllocated = totalRevenue * (employeePoolPercent / 100);
        const leadershipPoolAllocated = totalRevenue * (leadershipPoolPercent / 100);
        const ceoAmount = totalRevenue * (ceoPercent / 100);
        const cooAmount = totalRevenue * (cooPercent / 100);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        const last6Months = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            last6Months.push({
                monthKey: mKey,
                monthName: monthNames[d.getMonth()],
                revenue: 0,
                invoiced: 0,
                orders: 0,
            });
        }
        orders.forEach((o) => {
            if (o.createdAt) {
                const od = new Date(o.createdAt);
                const oKey = `${od.getFullYear()}-${String(od.getMonth() + 1).padStart(2, '0')}`;
                const target = last6Months.find((m) => m.monthKey === oKey);
                if (target) {
                    const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
                    const disc = Number(o.discount || 0);
                    const tx = Number(o.tax || 0);
                    const orderInvoiced = Math.max(0, sub - disc + tx) || Number(o.budget || 0);
                    const adv = Number(o.advance || 0);
                    const pmtSum = Array.isArray(o.payments)
                        ? o.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                        : 0;
                    const pStatus = String(o.paymentStatus || '').toLowerCase();
                    const orderPaid = pStatus === 'paid'
                        ? Math.max(orderInvoiced, adv, pmtSum)
                        : Math.max(adv, pmtSum);
                    target.revenue += orderPaid;
                    target.invoiced += orderInvoiced;
                    target.orders += 1;
                }
            }
        });
        const hasAnyInflow = last6Months.some((m) => m.revenue > 0 || m.invoiced > 0);
        const chartTrend = last6Months.map((m, idx) => ({
            name: m.monthName,
            revenue: Number(m.revenue.toFixed(2)),
            invoiced: Number(m.invoiced.toFixed(2)),
            orders: m.orders,
        }));
        if (!hasAnyInflow && totalRevenue > 0) {
            chartTrend[chartTrend.length - 1].revenue = totalRevenue;
            chartTrend[chartTrend.length - 1].invoiced = totalInvoiced;
            chartTrend[chartTrend.length - 1].orders = orders.length;
        }
        const orderStatusDistribution = [
            { name: 'Delivered', value: completedOrders, color: '#10B981' },
            { name: 'Ongoing', value: ongoingOrders, color: '#3B82F6' },
            { name: 'Delivery Pending', value: deliveryOrders, color: '#06B6D4' },
            { name: 'QA Test', value: qaOrders, color: '#8B5CF6' },
            { name: 'Onboarding', value: onboardOrders, color: '#F59E0B' },
        ].filter((item) => item.value > 0);
        const finalOrderStatusData = orderStatusDistribution.length > 0
            ? orderStatusDistribution
            : [
                { name: 'Delivered', value: 1, color: '#10B981' },
                { name: 'Ongoing', value: 1, color: '#3B82F6' },
                { name: 'Onboarding', value: 1, color: '#F59E0B' },
            ];
        const profitDistribution = [
            { name: 'Company Cost Fund', percent: companyCostPercent, amount: Number(companyCostAllocated.toFixed(2)), color: '#4F46E5' },
            { name: 'Employee Profit Pool', percent: employeePoolPercent, amount: Number(employeePoolAllocated.toFixed(2)), color: '#10B981' },
            { name: 'CEO Leadership Share', percent: ceoPercent, amount: Number(ceoAmount.toFixed(2)), color: '#F59E0B' },
            { name: 'COO Leadership Share', percent: cooPercent, amount: Number(cooAmount.toFixed(2)), color: '#8B5CF6' },
        ];
        const recentOrders = orders.slice(0, 6).map((o) => {
            const sub = o.subtotal !== undefined ? Number(o.subtotal) : Number(o.budget || 0);
            const disc = Number(o.discount || 0);
            const tx = Number(o.tax || 0);
            const orderInvoiced = Math.max(0, sub - disc + tx) || Number(o.budget || 0);
            const adv = Number(o.advance || 0);
            const pmtSum = Array.isArray(o.payments)
                ? o.payments.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                : 0;
            const pStatus = String(o.paymentStatus || '').toLowerCase();
            const orderPaid = pStatus === 'paid'
                ? Math.max(orderInvoiced, adv, pmtSum)
                : Math.max(adv, pmtSum);
            return {
                id: o.id,
                projectName: o.projectName,
                clientName: o.clientName || o.client?.name || 'Valued Client',
                clientEmail: o.clientEmail || o.client?.email || 'N/A',
                clientPicture: o.client?.picture || null,
                budget: orderInvoiced,
                advance: orderPaid,
                due: Math.max(0, orderInvoiced - orderPaid),
                status: o.status,
                paymentStatus: o.paymentStatus,
                invoiceNumber: o.invoiceNumber || 'INV-DRAFT',
                createdAt: o.createdAt,
            };
        });
        const nowTime = new Date();
        const currentYear = nowTime.getFullYear();
        const currentMonth = nowTime.getMonth();
        const todayDate = nowTime.getDate();
        const todayStart = new Date(currentYear, currentMonth, todayDate).getTime();
        const teamMembers = allUsers.filter((u) => u.role !== user_entity_1.UserRole.CLIENT);
        const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthFullNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December',
        ];
        const runningMonthName = monthFullNames[currentMonth];
        const upcomingBirthdays = teamMembers
            .filter((u) => !!u.dateOfBirth)
            .map((u) => {
            const parts = String(u.dateOfBirth).split('-');
            let birthMonth = -1;
            let birthDay = -1;
            if (parts.length === 3) {
                birthMonth = parseInt(parts[1], 10) - 1;
                birthDay = parseInt(parts[2], 10);
            }
            else if (parts.length === 2) {
                birthMonth = parseInt(parts[0], 10) - 1;
                birthDay = parseInt(parts[1], 10);
            }
            if (birthMonth < 0 || isNaN(birthMonth) || birthDay <= 0 || isNaN(birthDay)) {
                return null;
            }
            if (birthMonth !== currentMonth) {
                return null;
            }
            const formattedDate = `${birthDay} ${monthShortNames[birthMonth]}`;
            const diffDays = birthDay - todayDate;
            let statusText = '';
            let isToday = false;
            let isPast = false;
            if (diffDays === 0) {
                statusText = 'Today! 🎂';
                isToday = true;
            }
            else if (diffDays === 1) {
                statusText = 'Tomorrow 🎉';
            }
            else if (diffDays > 1) {
                statusText = `In ${diffDays} days`;
            }
            else {
                const pastDays = Math.abs(diffDays);
                statusText = pastDays === 1 ? 'Yesterday' : `${pastDays} days ago`;
                isPast = true;
            }
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                picture: u.picture,
                role: u.role,
                department: u.department?.name || 'General',
                designation: u.designation?.title || 'Team Member',
                dateOfBirth: u.dateOfBirth,
                formattedDate,
                birthDay,
                diffDays,
                statusText,
                isToday,
                isPast,
            };
        })
            .filter(Boolean)
            .sort((a, b) => {
            if (a.diffDays >= 0 && b.diffDays >= 0) {
                return a.diffDays - b.diffDays;
            }
            if (a.diffDays >= 0 && b.diffDays < 0) {
                return -1;
            }
            if (a.diffDays < 0 && b.diffDays >= 0) {
                return 1;
            }
            return b.diffDays - a.diffDays;
        });
        const newJoiners = teamMembers
            .map((u) => {
            const joinDate = u.joiningDate ? new Date(u.joiningDate) : new Date(u.createdAt);
            const joinTime = joinDate.getTime();
            const diffMs = Math.max(0, nowTime.getTime() - joinTime);
            const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            let relativeTime = '';
            if (daysAgo <= 0) {
                relativeTime = 'Joined today';
            }
            else if (daysAgo === 1) {
                relativeTime = '1 day ago';
            }
            else if (daysAgo < 30) {
                relativeTime = `${daysAgo} days ago`;
            }
            else if (daysAgo < 365) {
                const months = Math.floor(daysAgo / 30);
                relativeTime = months === 1 ? '1 month ago' : `${months} months ago`;
            }
            else {
                const years = Math.floor(daysAgo / 365);
                relativeTime = years === 1 ? '1 year ago' : `${years} years ago`;
            }
            const formattedDate = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
            const exactTime = joinDate.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
            });
            return {
                id: u.id,
                name: u.name,
                email: u.email,
                picture: u.picture,
                role: u.role,
                department: u.department?.name || 'General',
                designation: u.designation?.title || 'Team Member',
                joiningDate: u.joiningDate || u.createdAt,
                createdAt: u.createdAt,
                formattedDate,
                exactTime,
                fullDateTime: `${formattedDate} at ${exactTime}`,
                daysAgo,
                relativeTime,
                isNew: daysAgo <= 45,
            };
        })
            .sort((a, b) => a.daysAgo - b.daysAgo)
            .slice(0, 8);
        const totalVisitorRecords = await this.visitorRepository.count();
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const todayWebsiteVisitors = await this.visitorRepository
            .createQueryBuilder('v')
            .where('v.createdAt >= :today', { today: todayMidnight })
            .getCount();
        const totalBlogVisits = await this.visitorRepository
            .createQueryBuilder('v')
            .where("v.eventType = 'BLOG_VIEW'")
            .getCount();
        const todayBlogVisitors = await this.visitorRepository
            .createQueryBuilder('v')
            .where("v.eventType = 'BLOG_VIEW' AND v.createdAt >= :today", { today: todayMidnight })
            .getCount();
        const blogViewsRaw = await this.blogRepository
            .createQueryBuilder('b')
            .select('SUM(b.views)', 'totalViews')
            .getRawOne();
        const totalBlogViews = Number(blogViewsRaw?.totalViews || 0);
        const uniqueRaw = await this.visitorRepository
            .createQueryBuilder('v')
            .select('COUNT(DISTINCT v.ipAddress)', 'uniqueCount')
            .getRawOne();
        const uniqueVisitorsCount = Number(uniqueRaw?.uniqueCount || 0);
        const topViewedBlogs = await this.blogRepository.find({
            order: { views: 'DESC' },
            take: 5,
            select: {
                id: true,
                title: true,
                slug: true,
                views: true,
                createdAt: true,
                coverImage: true,
            },
        });
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const last7DaysTrend = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            last7DaysTrend.push({
                date: dateStr,
                day: dayNames[d.getDay()],
                websiteVisitors: 0,
                blogVisitors: 0,
            });
        }
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const recentVisits = await this.visitorRepository
            .createQueryBuilder('v')
            .where('v.createdAt >= :since', { since: sevenDaysAgo })
            .getMany();
        recentVisits.forEach((visit) => {
            const vd = new Date(visit.createdAt);
            const vDateStr = `${vd.getFullYear()}-${String(vd.getMonth() + 1).padStart(2, '0')}-${String(vd.getDate()).padStart(2, '0')}`;
            const entry = last7DaysTrend.find((item) => item.date === vDateStr);
            if (entry) {
                entry.websiteVisitors += 1;
                if (visit.eventType === 'BLOG_VIEW' || visit.blogSlug) {
                    entry.blogVisitors += 1;
                }
            }
        });
        const totalWebsiteVisitorsCount = totalVisitorRecords;
        const totalBlogReadersCount = Math.max(totalBlogVisits, totalBlogViews);
        return {
            projectDeliveries: projectDeliveries > 0 ? projectDeliveries : (completedOrders > 0 ? completedOrders : 400),
            inHouseExperts: inHouseExperts > 0 ? inHouseExperts : 15,
            satisfiedClients: 99,
            businessPartners: businessPartners > 0 ? businessPartners : 40,
            totalWebsiteVisitors: totalWebsiteVisitorsCount,
            todayWebsiteVisitors,
            totalBlogReaders: totalBlogReadersCount,
            todayBlogVisitors,
            uniqueVisitorsCount,
            topViewedBlogs,
            visitorTrend: last7DaysTrend,
            overview: {
                totalRevenue: Number(totalRevenue.toFixed(2)),
                totalInvoiced: Number(totalInvoiced.toFixed(2)),
                totalDue: Number(totalDue.toFixed(2)),
                totalTreasury: Number(totalTreasury.toFixed(2)),
                totalInvestorCapital: Number(totalInvestorCapital.toFixed(2)),
                totalApprovedExpenses: Number(totalApprovedExpenses.toFixed(2)),
                pendingExpensesAmount: Number(pendingExpensesAmount.toFixed(2)),
                pendingExpensesCount,
                totalOrders: orders.length,
                completedOrders,
                ongoingOrders,
                qaOrders,
                deliveryOrders,
                onboardOrders,
                totalUsers: allUsers.length,
                totalClients,
                totalEmployees: inHouseExperts,
                totalExecutives,
                totalBlogs,
                totalCaseStudies: projectDeliveries,
                businessPartners,
                totalReviews,
                totalWebsiteVisitors: totalWebsiteVisitorsCount,
                todayWebsiteVisitors,
                totalBlogReaders: totalBlogReadersCount,
                todayBlogVisitors,
                uniqueVisitorsCount,
                topViewedBlogs,
                pools: {
                    companyCost: {
                        percent: companyCostPercent,
                        allocated: Number(companyCostAllocated.toFixed(2)),
                        spent: totalApprovedExpenses,
                        remaining: Number(Math.max(0, companyCostAllocated - totalApprovedExpenses).toFixed(2)),
                    },
                    employeePool: {
                        percent: employeePoolPercent,
                        allocated: Number(employeePoolAllocated.toFixed(2)),
                    },
                    leadershipPool: {
                        percent: leadershipPoolPercent,
                        allocated: Number(leadershipPoolAllocated.toFixed(2)),
                        ceoPercent,
                        cooPercent,
                        ceoAmount: Number(ceoAmount.toFixed(2)),
                        cooAmount: Number(cooAmount.toFixed(2)),
                    },
                },
            },
            charts: {
                revenueTrend: chartTrend,
                orderStatusDistribution: finalOrderStatusData,
                profitDistribution,
                visitorTrend: last7DaysTrend,
            },
            recentOrders,
            runningMonthName,
            upcomingBirthdays,
            newJoiners,
        };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(casestudy_entity_1.Casestudy)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(partner_entity_1.Partner)),
    __param(3, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, typeorm_1.InjectRepository)(investor_capital_entity_1.InvestorCapital)),
    __param(5, (0, typeorm_1.InjectRepository)(company_expense_entity_1.CompanyExpense)),
    __param(6, (0, typeorm_1.InjectRepository)(financial_setting_entity_1.FinancialSetting)),
    __param(7, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __param(8, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(9, (0, typeorm_1.InjectRepository)(visitor_entity_1.WebsiteVisitor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StatsService);
//# sourceMappingURL=stats.service.js.map