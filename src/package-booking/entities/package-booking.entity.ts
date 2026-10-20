import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Package } from '../../package/entities/package.entity';

@Entity('package_bookings')
export class PackageBooking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  userEmail: string;

  @Column({ type: 'varchar', length: 150 })
  companyName: string;

  @Column({ type: 'varchar', length: 150 })
  companyEmail: string;

  @Column({ type: 'varchar', length: 100 })
  billingCycle: string;

  @Column({ type: 'uuid' })
  packageId: string;

  @ManyToOne(() => Package, { nullable: true, createForeignKeyConstraints: false, eager: true })
  @JoinColumn({ name: 'packageId' })
  package?: Package;

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
