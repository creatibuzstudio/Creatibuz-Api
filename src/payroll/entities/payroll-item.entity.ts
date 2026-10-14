import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MonthlyPayroll } from './monthly-payroll.entity';
import { User } from '../../users/entities/user.entity';

export enum PayrollRecipientType {
  EMPLOYEE = 'employee',
  CEO = 'ceo',
  COO = 'coo',
}

export enum PayrollItemStatus {
  PENDING = 'pending',
  PAID = 'paid',
  WITHDRAWN = 'withdrawn',
}

@Entity('payroll_items')
export class PayrollItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => MonthlyPayroll, (payroll) => payroll.items, {
    onDelete: 'CASCADE',
  })
  monthlyPayroll: MonthlyPayroll;

  @Column({ type: 'uuid' })
  monthlyPayrollId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 150 })
  recipientName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  recipientRole: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string;

  @Column({
    type: 'enum',
    enum: PayrollRecipientType,
    default: PayrollRecipientType.EMPLOYEE,
  })
  type: PayrollRecipientType;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  baseSalary: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
  profitSharePercent: number; // % of employee pool

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  profitShareAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonus: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductions: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  netPayable: number;

  @Column({
    type: 'enum',
    enum: PayrollItemStatus,
    default: PayrollItemStatus.PENDING,
  })
  paymentStatus: PayrollItemStatus;

  @Column({ type: 'varchar', length: 50, nullable: true })
  paymentMethod: string; // 'bank_transfer', 'cash', 'bkash', etc.

  @Column({ type: 'varchar', length: 150, nullable: true })
  transactionReference: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  voucherNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
