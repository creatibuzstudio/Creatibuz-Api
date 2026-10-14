import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateCapitalDto } from './dto/create-capital.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApproveExpenseDto } from './dto/approve-expense.dto';
import { ExpenseStatus } from './entities/company-expense.entity';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('overview')
  async getOverview() {
    const data = await this.financeService.getOverview();
    return {
      statusCode: HttpStatus.OK,
      message: 'Financial overview and distribution retrieved successfully',
      data,
    };
  }

  @Get('settings')
  async getSettings() {
    const data = await this.financeService.getSettings();
    return {
      statusCode: HttpStatus.OK,
      message: 'Financial distribution settings retrieved successfully',
      data,
    };
  }

  @Patch('settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    const data = await this.financeService.updateSettings(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Financial distribution settings updated successfully',
      data,
    };
  }

  @Get('executives')
  async getExecutives() {
    const data = await this.financeService.getExecutiveUsers();
    return {
      statusCode: HttpStatus.OK,
      message: 'Executive users (CEO & COO) retrieved successfully',
      data,
    };
  }

  // --- Investor Capitals ---
  @Get('capitals')
  async findAllCapitals() {
    const data = await this.financeService.findAllCapitals();
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor capital records retrieved successfully',
      data,
    };
  }

  @Post('capitals')
  async createCapital(@Body() dto: CreateCapitalDto) {
    const data = await this.financeService.createCapital(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Investor capital recorded successfully',
      data,
    };
  }

  @Delete('capitals/:id')
  async deleteCapital(@Param('id') id: string) {
    await this.financeService.deleteCapital(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Investor capital removed successfully',
    };
  }

  // --- Company Expenses & Approvals ---
  @Get('expenses')
  async findAllExpenses(@Query('status') status?: ExpenseStatus) {
    const data = await this.financeService.findAllExpenses(status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Company expenses retrieved successfully',
      data,
    };
  }

  @Get('expenses/:id')
  async findOneExpense(@Param('id') id: string) {
    const data = await this.financeService.findOneExpense(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Company expense details retrieved successfully',
      data,
    };
  }

  @Post('expenses')
  async createExpense(@Body() dto: CreateExpenseDto) {
    const data = await this.financeService.createExpense(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Company expense requested successfully',
      data,
    };
  }

  @Patch('expenses/:id/approve')
  async approveExpense(
    @Param('id') id: string,
    @Body() dto: ApproveExpenseDto,
  ) {
    const data = await this.financeService.approveExpense(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Expense approval status updated successfully',
      data,
    };
  }

  @Delete('expenses/:id')
  async deleteExpense(@Param('id') id: string) {
    await this.financeService.deleteExpense(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Company expense removed successfully',
    };
  }
}
