import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'clientId' })
  client: User;

  @Column({ type: 'varchar', nullable: true })
  thumbUrl: string;

  @Column({ type: 'varchar', nullable: true })
  videoUrl: string;

  @Column({ type: 'text' })
  reviewText: string;

  @Column({ type: 'int', default: 5 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
