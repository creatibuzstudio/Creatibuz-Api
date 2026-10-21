import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('about_stats')
export class AboutStatsSetting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', default: 400 })
  projectDeliveries: number;

  @Column({ type: 'int', default: 15 })
  inHouseExperts: number;

  @Column({ type: 'int', default: 99 })
  satisfiedClients: number;

  @Column({ type: 'int', default: 40 })
  businessPartners: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
