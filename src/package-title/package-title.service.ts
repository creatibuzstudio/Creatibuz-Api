import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePackageTitleDto } from './dto/create-package-title.dto';
import { UpdatePackageTitleDto } from './dto/update-package-title.dto';
import { PackageTitle } from './entities/package-title.entity';

@Injectable()
export class PackageTitleService implements OnModuleInit {
  private readonly logger = new Logger(PackageTitleService.name);
  private isTableChecked = false;

  constructor(
    @InjectRepository(PackageTitle)
    private readonly packageTitleRepository: Repository<PackageTitle>,
  ) {}

  async onModuleInit() {
    await this.ensureTableAndColumnsExist();
  }

  private async ensureTableAndColumnsExist() {
    if (this.isTableChecked) return;
    try {
      await this.packageTitleRepository.query(`
        CREATE TABLE IF NOT EXISTS "package_titles" (
          "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          "name" varchar(150) NOT NULL,
          "isActive" boolean DEFAULT true,
          "createdAt" TIMESTAMP DEFAULT now(),
          "updatedAt" TIMESTAMP DEFAULT now()
        );
      `);

      await this.packageTitleRepository.query(`
        ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "titleId" uuid;
      `);

      await this.packageTitleRepository.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint WHERE conname = 'FK_packages_title'
          ) THEN
            ALTER TABLE "packages" ADD CONSTRAINT "FK_packages_title" FOREIGN KEY ("titleId") REFERENCES "package_titles"("id") ON DELETE SET NULL;
          END IF;
        END $$;
      `);

      // Seed common titles if table is empty
      const count = await this.packageTitleRepository.count();
      if (count === 0) {
        const defaults = [
          'Design only',
          'Design + Development',
          'Design + Dev + Branding',
          'Full-Scale Solution',
          'Starter Plan',
        ];
        for (const name of defaults) {
          await this.packageTitleRepository.save(
            this.packageTitleRepository.create({ name, isActive: true }),
          );
        }
        this.logger.log('Seeded default package titles');
      }

      this.isTableChecked = true;
      this.logger.log('Package titles table and package.titleId column verified.');
    } catch (err: any) {
      this.logger.warn(`Could not verify/migrate package_titles: ${err?.message}`);
    }
  }

  async create(createPackageTitleDto: CreatePackageTitleDto): Promise<PackageTitle> {
    await this.ensureTableAndColumnsExist();
    const title = this.packageTitleRepository.create(createPackageTitleDto);
    return await this.packageTitleRepository.save(title);
  }

  async findAll(): Promise<PackageTitle[]> {
    await this.ensureTableAndColumnsExist();
    return await this.packageTitleRepository.find({
      relations: { packages: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PackageTitle> {
    await this.ensureTableAndColumnsExist();
    const title = await this.packageTitleRepository.findOne({
      where: { id },
      relations: { packages: true },
    });
    if (!title) {
      throw new NotFoundException(`Package Title with ID ${id} not found`);
    }
    return title;
  }

  async update(id: string, updatePackageTitleDto: UpdatePackageTitleDto): Promise<PackageTitle> {
    await this.ensureTableAndColumnsExist();
    const title = await this.findOne(id);
    Object.assign(title, updatePackageTitleDto);
    return await this.packageTitleRepository.save(title);
  }

  async remove(id: string): Promise<void> {
    await this.ensureTableAndColumnsExist();
    const title = await this.findOne(id);
    await this.packageTitleRepository.remove(title);
  }
}
