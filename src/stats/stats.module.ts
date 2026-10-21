import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { Casestudy } from '../casestudies/entities/casestudy.entity';
import { User } from '../users/entities/user.entity';
import { Partner } from '../partners/entities/partner.entity';
import { Order } from '../orders/entities/order.entity';
import { InvestorCapital } from '../finance/entities/investor-capital.entity';
import { CompanyExpense } from '../finance/entities/company-expense.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';
import { Blog } from '../blog/entities/blog.entity';
import { Review } from '../review/entities/review.entity';
import { WebsiteVisitor } from './entities/visitor.entity';
import { AboutStatsSetting } from './entities/about-stats.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Casestudy,
      User,
      Partner,
      Order,
      InvestorCapital,
      CompanyExpense,
      FinancialSetting,
      Blog,
      Review,
      WebsiteVisitor,
      AboutStatsSetting,
    ]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
