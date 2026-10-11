import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PackageCategory } from '../../package-category/entities/package-category.entity';

@Entity('packages')
export class Package {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column('simple-array')
  features: string[];

  @Column({ type: 'varchar', length: 100 })
  duration: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => PackageCategory, (category) => category.packages, { nullable: true, onDelete: 'SET NULL' })
  category: PackageCategory;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
