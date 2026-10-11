import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
@Entity('casestudies')
export class Casestudy {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ type: 'varchar', length: 500 })
    shortDescription: string;

    @Column({ type: 'text' })
    fullDescription: string;

    @Column({ type: 'varchar', length: 255 })
    photoUrl: string;

    @Column({ type: 'uuid', nullable: true })
    categoryId: string;

    @ManyToOne(() => Category, category => category.casestudies, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column({ type: 'varchar', length: 255, nullable: true })
    projectLink?: string;

    @Column({ type: 'text', nullable: true })
    challenge?: string;

    @Column({ type: 'text', nullable: true })
    solution?: string;

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
