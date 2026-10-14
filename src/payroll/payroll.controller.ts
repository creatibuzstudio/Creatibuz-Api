import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { GeneratePayrollDto } from './dto/generate-payroll.dto';
import { DisbursePayrollDto } from './dto/disburse-payroll.dto';
import { WithdrawExecutiveDto } from './dto/withdraw-executive.dto';

@Controller('payroll')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  @Get('summary')
  async getMonthlySummary(@Query('month') month?: string) {
    return await this.payrollService.getMonthlySummary(month);
  }

  @Post('generate')
  async generateOrUpdatePayroll(@Body() dto: GeneratePayrollDto) {
    return await this.payrollService.generateOrUpdatePayroll(dto);
  }

  @Post('withdraw-executive')
  async withdrawExecutive(@Body() dto: WithdrawExecutiveDto) {
    return await this.payrollService.withdrawExecutiveShare(dto);
  }

  @Post('disburse')
  async disbursePayroll(@Body() dto: DisbursePayrollDto) {
    return await this.payrollService.disburseEmployeePayroll(dto);
  }

  @Get('history')
  async getPayrollHistory() {
    return await this.payrollService.getPayrollHistory();
  }

  @Get('my-payslips')
  async getMyPayslips(
    @Query('userId') userId?: string,
    @Query('email') email?: string,
  ) {
    return await this.payrollService.getMyPayslips(userId, email);
  }

  @Get('item/:id')
  async getPayslip(@Param('id') id: string) {
    return await this.payrollService.getPayslip(id);
  }
}

