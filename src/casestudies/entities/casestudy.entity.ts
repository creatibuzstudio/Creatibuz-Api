import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('casestudies')
export class Casestudy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    slug: string;

    @Column({ type: 'varchar', length: 500, nullable: true })
    shortDescription: string;

    @Column({ type: 'text', nullable: true })
    fullDescription: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    photoUrl: string;

    // Multi-images (supports array of image URLs or structured images object like hero/rightTop/rightBottom)
    @Column({ type: 'jsonb', nullable: true })
    images?: any;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category, category => category.casestudies, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ type: 'varchar', length: 100, nullable: true })
    tag?: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    bgColor?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    projectLink?: string;

    // Stats / Metrics: name & count or label & value (e.g. 76% Workflow efficiency, 78% Team productivity, 1.2M+ Client workflows optimized)
    @Column({ type: 'jsonb', nullable: true })
    stats?: Array<{ name: string; count: string; label?: string; value?: string }>;

    @Column({ type: 'jsonb', nullable: true })
    metrics?: Array<{ label: string; value: string; name?: string; count?: string }>;

    // Challenge section with text, single photo & description, and photo-wise gallery list
    @Column({ type: 'text', nullable: true })
    challenge?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    challengePhoto?: string;

    @Column({ type: 'text', nullable: true })
    challengePhotoDescription?: string;

    @Column({ type: 'jsonb', nullable: true })
    challengePhotos?: Array<{ photoUrl: string; description?: string; title?: string }>;

    // Solution section with text, single photo & description, and photo-wise gallery list
    @Column({ type: 'text', nullable: true })
    solution?: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    solutionPhoto?: string;

    @Column({ type: 'text', nullable: true })
    solutionPhotoDescription?: string;

    @Column({ type: 'jsonb', nullable: true })
    solutionPhotos?: Array<{ photoUrl: string; description?: string; title?: string }>;

    @Column({ type: 'text', nullable: true })
    technologies?: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
