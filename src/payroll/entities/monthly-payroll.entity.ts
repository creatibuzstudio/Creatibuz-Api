import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PayrollItem } from './payroll-item.entity';

export enum PayrollStatus {
  DRAFT = 'draft',
  APPROVED = 'approved',
  PAID = 'paid',
}

@Entity('monthly_payrolls')
export class MonthlyPayroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  monthYear: string; // e.g. '2026-10'

  @Column({ type: 'varchar', length: 50 })
  monthName: string; // e.g. 'October 2026'

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.DRAFT,
  })
  status: PayrollStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalOrderRevenue: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40 })
  companyCostPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  companyCostAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 30 })
  employeePoolPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  employeePoolAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 30 })
  leadershipPoolPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  leadershipPoolAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 20 })
  ceoPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  ceoAmount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40 })
  cooPercent: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  cooAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalBaseSalary: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalProfitShare: number;

  @Column({ type: 'int', default: 0 })
  totalEmployeesPaid: number;

  @Column({ type: 'timestamp', nullable: true })
  processedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  disbursedAt: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  processedBy: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => PayrollItem, (item) => item.monthlyPayroll, {
    cascade: true,
  })
  items: PayrollItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
