import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('website_visitors')
export class WebsiteVisitor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', length: 300, nullable: true })
  userAgent: string;

  @Column({ type: 'varchar', length: 255, default: '/' })
  pagePath: string;

  @Column({ type: 'varchar', length: 50, default: 'PAGE_VIEW' })
  eventType: string; // 'PAGE_VIEW', 'BLOG_VIEW'

  @Column({ type: 'varchar', length: 255, nullable: true })
  blogSlug: string;

  @CreateDateColumn()
  createdAt: Date;
}
