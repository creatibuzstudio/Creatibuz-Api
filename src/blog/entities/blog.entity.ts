import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', nullable: true })
  coverImage: string;

  @Column({ type: 'text', nullable: true })
  excerpt: string;

  @Column({ type: 'text', nullable: true })
  shortDescription: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 150, default: 'Admin' })
  author: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  seoTitle: string;

  @Column({ type: 'text', nullable: true })
  seoDescription: string;

  @Column({ type: 'text', nullable: true })
  seoKeywords: string;

  @Column({ type: 'text', nullable: true })
  keywords: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  metaTitle: string;

  @Column({ type: 'text', nullable: true })
  metaDescription: string;

  @Column({ type: 'text', nullable: true })
  metaKeywords: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
