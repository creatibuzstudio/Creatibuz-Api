import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  whatsapp: string;

  @Column('text')
  productDetails: string;

  @Column()
  budget: string;

  @CreateDateColumn()
  createdAt: Date;
}
