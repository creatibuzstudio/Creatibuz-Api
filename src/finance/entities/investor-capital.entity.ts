import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('investor_capitals')
export class InvestorCapital {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  user: User;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string;

  @Column({ type: 'varchar', length: 150 })
  investorName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  investorEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  investorPhone: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  investmentDate: Date;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  equityPercentage: number;

  @Column({ type: 'varchar', length: 100, default: 'Bank Transfer' })
  paymentMethod: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({ type: 'text', nullable: true })
  documentUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
