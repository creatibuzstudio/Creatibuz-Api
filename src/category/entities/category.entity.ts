import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Casestudy } from '../../casestudies/entities/casestudy.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    icon?: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'boolean', default: true })
    isActive: boolean;

    @OneToMany(() => Casestudy, casestudy => casestudy.category)
    casestudies: Casestudy[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
