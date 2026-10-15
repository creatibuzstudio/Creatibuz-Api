import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ActivityAction {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  DISBURSE_PAYROLL = 'DISBURSE_PAYROLL',
  WITHDRAW_SHARE = 'WITHDRAW_SHARE',
  APPROVE_EXPENSE = 'APPROVE_EXPENSE',
  REJECT_EXPENSE = 'REJECT_EXPENSE',
  UPDATE_SETTINGS = 'UPDATE_SETTINGS',
  STATUS_CHANGE = 'STATUS_CHANGE',
  EXPORT_REPORT = 'EXPORT_REPORT',
  DOWNLOAD_STATEMENT = 'DOWNLOAD_STATEMENT',
  SYSTEM = 'SYSTEM',
}

export enum ActivityModule {
  AUTH = 'AUTH',
  USERS = 'USERS',
  PAYROLL = 'PAYROLL',
  FINANCE = 'FINANCE',
  ORDERS = 'ORDERS',
  BLOGS = 'BLOGS',
  CASE_STUDIES = 'CASE_STUDIES',
  PACKAGES = 'PACKAGES',
  SETTINGS = 'SETTINGS',
  SYSTEM = 'SYSTEM',
}

export enum ActivityStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  WARNING = 'WARNING',
}

@Entity('activity_logs')
export class ActivityLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  userId: string;

  @Column({ type: 'varchar', length: 150, default: 'System User' })
  userName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userRole: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  userPicture: string;

  @Column({ type: 'varchar', length: 60 })
  action: string;

  @Column({ type: 'varchar', length: 60 })
  module: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  targetId: string;

  @Column({ type: 'text', nullable: true })
  details: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 20, default: ActivityStatus.SUCCESS })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
