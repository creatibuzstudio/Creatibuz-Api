import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';
import { InvestorCapital } from '../finance/entities/investor-capital.entity';
import { CompanyExpense, ExpenseStatus } from '../finance/entities/company-expense.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';
import { Blog } from '../blog/entities/blog.entity';
import { Review } from '../review/entities/review.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Casestudy)
    private casestudyRepository: Repository<Casestudy>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(InvestorCapital)
    private capitalRepository: Repository<InvestorCapital>,
    @InjectRepository(CompanyExpense)
    private expenseRepository: Repository<CompanyExpense>,
    @InjectRepository(FinancialSetting)
    private settingRepository: Repository<FinancialSetting>,
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getStats() {
    // 1. Basic counts
    const projectDeliveries = await this.casestudyRepository.count();
    const allUsers = await this.userRepository.find({
      relations: { designation: true, department: true },
    });
    const inHouseExperts = allUsers.filter((u) => u.role !== UserRole.CLIENT).length;
    const totalClients = allUsers.filter((u) => u.role === UserRole.CLIENT).length;
    const totalExecutives = allUsers.filter(
      (u) => u.role?.toLowerCase() === 'ceo' || u.role?.toLowerCase() === 'coo',
    ).length;

    const businessPartners = await this.partnerRepository.count();
    const totalBlogs = await this.blogRepository.count();
    const totalReviews = await this.reviewRepository.count();

    // 2. Orders & Revenue Calculation
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

      // If order is paid, the full invoiced amount is collected as revenue.
      // Otherwise, any advance or recorded payments are added to revenue.
      const orderPaid =
        pStatus === 'paid'
          ? Math.max(orderInvoiced, adv, pmtSum)
          : Math.max(adv, pmtSum);

      totalRevenue += orderPaid;
      totalInvoiced += orderInvoiced;

      const st = String(o.status || '').toLowerCase();
      if (st === OrderStatus.DELIVERED || st === 'delivered') {
        completedOrders += 1;
      } else if (st === OrderStatus.ONGOING || st === 'ongoing') {
        ongoingOrders += 1;
      } else if (st === OrderStatus.QA_TEST || st === 'qa test') {
        qaOrders += 1;
      } else if (st === OrderStatus.DELIVERY || st === 'delivery') {
        deliveryOrders += 1;
      } else {
        onboardOrders += 1;
      }
    });

    const totalDue = Math.max(0, totalInvoiced - totalRevenue);

    // 3. Investor Capital & Treasury
    const capitals = await this.capitalRepository.find();
    let totalInvestorCapital = 0;
    capitals.forEach((c) => {
      totalInvestorCapital += Number(c.amount || 0);
    });

    // 4. Expenses & Approvals
    const expenses = await this.expenseRepository.find();
    let totalApprovedExpenses = 0;
    let pendingExpensesAmount = 0;
    let pendingExpensesCount = 0;

    expenses.forEach((e) => {
      const amt = Number(e.amount || 0);
      if (e.status === ExpenseStatus.APPROVED) {
        totalApprovedExpenses += amt;
      } else if (
        e.status === ExpenseStatus.PENDING ||
        e.status === ExpenseStatus.CEO_APPROVED ||
        e.status === ExpenseStatus.COO_APPROVED
      ) {
        pendingExpensesAmount += amt;
        pendingExpensesCount += 1;
      }
    });

    const totalTreasury = totalInvestorCapital + totalRevenue - totalApprovedExpenses;

    // 5. Dynamic Profit Distribution Settings
    const settings = await this.settingRepository.find({
      order: { createdAt: 'ASC' },
      take: 1,
    });
    let setting = settings[0] || null;

    const companyCostPercent = Number(setting?.companyCostPercent || 40);
    const employeePoolPercent = Number(setting?.employeePoolPercent || 30);
    const leadershipPoolPercent = Number(setting?.leadershipPoolPercent || 30);

    const ceoPercent =
      setting?.ceoPercent !== undefined && setting?.ceoPercent !== null
        ? Number(setting.ceoPercent)
        : Number((leadershipPoolPercent * (Number(setting?.ceoShareRatio || 60) / 100)).toFixed(1));

    const cooPercent =
      setting?.cooPercent !== undefined && setting?.cooPercent !== null
        ? Number(setting.cooPercent)
        : Number((leadershipPoolPercent * (Number(setting?.cooShareRatio || 40) / 100)).toFixed(1));

    const companyCostAllocated = totalRevenue * (companyCostPercent / 100);
    const employeePoolAllocated = totalRevenue * (employeePoolPercent / 100);
    const leadershipPoolAllocated = totalRevenue * (leadershipPoolPercent / 100);
    const ceoAmount = totalRevenue * (ceoPercent / 100);
    const cooAmount = totalRevenue * (cooPercent / 100);

    // 6. Generate Revenue & Orders Trends for Charts (Monthly aggregations)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const last6Months: Array<{ monthKey: string; monthName: string; revenue: number; invoiced: number; orders: number }> = [];

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
          const orderPaid =
            pStatus === 'paid'
              ? Math.max(orderInvoiced, adv, pmtSum)
              : Math.max(adv, pmtSum);

          target.revenue += orderPaid;
          target.invoiced += orderInvoiced;
          target.orders += 1;
        }
      }
    });

    // If all historical months are 0 because of demo data or current month orders, distribute realistic baseline
    const hasAnyInflow = last6Months.some((m) => m.revenue > 0 || m.invoiced > 0);
    const chartTrend = last6Months.map((m, idx) => ({
      name: m.monthName,
      revenue: Number(m.revenue.toFixed(2)),
      invoiced: Number(m.invoiced.toFixed(2)),
      orders: m.orders,
    }));

    // If empty or only current month, make sure the current month reflects totalRevenue
    if (!hasAnyInflow && totalRevenue > 0) {
      chartTrend[chartTrend.length - 1].revenue = totalRevenue;
      chartTrend[chartTrend.length - 1].invoiced = totalInvoiced;
      chartTrend[chartTrend.length - 1].orders = orders.length;
    }

    // 7. Order Status Distribution for Pie/Donut Chart
    const orderStatusDistribution = [
      { name: 'Delivered', value: completedOrders, color: '#10B981' },
      { name: 'Ongoing', value: ongoingOrders, color: '#3B82F6' },
      { name: 'Delivery Pending', value: deliveryOrders, color: '#06B6D4' },
      { name: 'QA Test', value: qaOrders, color: '#8B5CF6' },
      { name: 'Onboarding', value: onboardOrders, color: '#F59E0B' },
    ].filter((item) => item.value > 0);

    // If no orders yet, show sample breakdown
    const finalOrderStatusData =
      orderStatusDistribution.length > 0
        ? orderStatusDistribution
        : [
            { name: 'Delivered', value: 1, color: '#10B981' },
            { name: 'Ongoing', value: 1, color: '#3B82F6' },
            { name: 'Onboarding', value: 1, color: '#F59E0B' },
          ];

    // 8. Profit Distribution slices for Donut Chart
    const profitDistribution = [
      { name: 'Company Cost Fund', percent: companyCostPercent, amount: Number(companyCostAllocated.toFixed(2)), color: '#4F46E5' },
      { name: 'Employee Profit Pool', percent: employeePoolPercent, amount: Number(employeePoolAllocated.toFixed(2)), color: '#10B981' },
      { name: 'CEO Leadership Share', percent: ceoPercent, amount: Number(ceoAmount.toFixed(2)), color: '#F59E0B' },
      { name: 'COO Leadership Share', percent: cooPercent, amount: Number(cooAmount.toFixed(2)), color: '#8B5CF6' },
    ];

    // 9. Recent Orders list
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
      const orderPaid =
        pStatus === 'paid'
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

    return {
      // Landing page backward compatibility:
      projectDeliveries: Math.max(projectDeliveries, 50),
      inHouseExperts: Math.max(inHouseExperts, 15),
      satisfiedClients: 99,
      businessPartners: Math.max(businessPartners, 5),

      // Comprehensive Dashboard Statistics for HR PANEL:
      overview: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalInvoiced: Number(totalInvoiced.toFixed(2)),
        totalDue: Number(totalDue.toFixed(2)),
        totalTreasury: Number(totalTreasury.toFixed(2)),
        totalInvestorCapital: Number(totalInvestorCapital.toFixed(2)),
        totalApprovedExpenses: Number(totalApprovedExpenses.toFixed(2)),
        pendingExpensesAmount: Number(pendingExpensesAmount.toFixed(2)),
        pendingExpensesCount,

        // Order metrics
        totalOrders: orders.length,
        completedOrders,
        ongoingOrders,
        qaOrders,
        deliveryOrders,
        onboardOrders,

        // User & Team metrics
        totalUsers: allUsers.length,
        totalClients,
        totalEmployees: inHouseExperts,
        totalExecutives,

        // Content metrics
        totalBlogs,
        totalCaseStudies: projectDeliveries,
        businessPartners,
        totalReviews,

        // Profit Pools Breakdown
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
      },

      recentOrders,
    };
  }
}
