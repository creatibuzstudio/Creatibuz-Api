import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { InvestorCapital } from './entities/investor-capital.entity';
import { FinancialSetting } from './entities/financial-setting.entity';
import { CompanyExpense } from './entities/company-expense.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvestorCapital,
      FinancialSetting,
      CompanyExpense,
      User,
      Order,
    ]),
  ],
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
})
export class FinanceModule {}
