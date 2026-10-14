import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../category/entities/category.entity';

export enum OrderStatus {
  ONBOARD = 'onboard',
  ONGOING = 'ongoing',
  DELIVERY = 'delivery',
  QA_TEST = 'qa test',
  DELIVERED = 'delivered',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  projectName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  budget: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  advance: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.UNPAID })
  paymentStatus: PaymentStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  duration: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.ONBOARD })
  status: OrderStatus;

  @Column({ type: 'varchar', length: 100, nullable: true })
  invoiceNumber: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  projectProgress: string;

  @Column({ type: 'date', nullable: true })
  dueDate: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  tax: number;

  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  payments?: Array<{
    id: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    transactionId?: string;
    receiptNumber?: string;
    note?: string;
    createdAt?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  clientName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  clientEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  clientPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  clientAddress: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  client: User;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category: Category;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
