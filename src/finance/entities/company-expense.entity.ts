import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ExpenseStatus {
  PENDING = 'pending',
  CEO_APPROVED = 'ceo_approved',
  COO_APPROVED = 'coo_approved',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('company_expenses')
export class CompanyExpense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  voucherNumber: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100, default: 'Operations' })
  category: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  expenseDate: Date;

  @Column({ type: 'varchar', length: 150, nullable: true })
  vendor: string;

  @Column({ type: 'text', nullable: true })
  receiptUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  requestedByName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  requestedByUserId: string;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.PENDING,
  })
  status: ExpenseStatus;

  @Column({ type: 'jsonb', nullable: true })
  ceoApproval?: {
    approved: boolean;
    date?: string;
    userId?: string;
    userName?: string;
    comment?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  cooApproval?: {
    approved: boolean;
    date?: string;
    userId?: string;
    userName?: string;
    comment?: string;
  };

  @Column({ type: 'varchar', length: 100, default: 'company_cost_fund' })
  disbursedFrom: string;

  @Column({ type: 'boolean', default: false })
  isDisbursed: boolean;

  @Column({ type: 'date', nullable: true })
  disbursedDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
