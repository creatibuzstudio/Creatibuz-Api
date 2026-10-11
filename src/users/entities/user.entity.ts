import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Department } from '../../department/entities/department.entity';
import { Designation } from '../../designation/entities/designation.entity';

export enum UserRole {
  ADMIN = 'admin',
  EMPLOYEE = 'employee',
  CTO = 'cto',
  CEO = 'ceo',
  COO = 'coo',
  CPM = 'cpm',
  FOUNDER = 'founder',
  HR = 'hr',
  DEVELOPER = 'developer',
  CLIENT = 'client',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @ManyToOne(() => Department, department => department.users, { nullable: true, onDelete: 'SET NULL' })
  department: Department;

  @ManyToOne(() => Designation, designation => designation.users, { nullable: true, onDelete: 'SET NULL' })
  designation: Designation;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
