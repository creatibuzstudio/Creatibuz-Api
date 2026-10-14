import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('financial_settings')
export class FinancialSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40 })
  companyCostPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 30 })
  employeePoolPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 30 })
  leadershipPoolPercent: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ceoUserId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  cooUserId: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 60 })
  ceoShareRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 40 })
  cooShareRatio: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 18 })
  ceoPercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 12 })
  cooPercent: number;

  @Column({ type: 'boolean', default: true })
  autoDeductCostFromCompanyFund: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
