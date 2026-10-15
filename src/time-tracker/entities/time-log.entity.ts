import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum TimeLogStatus {
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  BREAK = 'BREAK',
}

@Entity('time_logs')
export class TimeLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  userId: string;

  @Column({ type: 'varchar', length: 150 })
  userName: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  userEmail: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  userRole: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  userPicture: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string;

  @Column({ type: 'varchar', length: 15 })
  date: string; // YYYY-MM-DD format

  @Column({ type: 'timestamp' })
  clockInTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  clockOutTime: Date;

  @Column({ type: 'text', nullable: true })
  clockInPhoto: string;

  @Column({ type: 'text', nullable: true })
  clockOutPhoto: string;

  @Column({ type: 'int', default: 0 })
  durationSeconds: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'varchar', length: 30, default: TimeLogStatus.RUNNING })
  status: string;

  @Column({ type: 'varchar', length: 60, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  device: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
