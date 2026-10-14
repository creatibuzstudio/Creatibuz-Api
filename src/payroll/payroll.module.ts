import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PayrollService } from './payroll.service';
import { PayrollController } from './payroll.controller';
import { MonthlyPayroll } from './entities/monthly-payroll.entity';
import { PayrollItem } from './entities/payroll-item.entity';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { FinancialSetting } from '../finance/entities/financial-setting.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MonthlyPayroll,
      PayrollItem,
      User,
      Order,
      FinancialSetting,
    ]),
  ],
  controllers: [PayrollController],
  providers: [PayrollService],
  exports: [PayrollService],
})
export class PayrollModule {}
