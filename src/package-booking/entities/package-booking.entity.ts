import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

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

  @Column({ type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
