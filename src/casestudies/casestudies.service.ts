import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCasestudyDto } from './dto/create-casestudy.dto';
import { UpdateCasestudyDto } from './dto/update-casestudy.dto';
import { Casestudy } from './entities/casestudy.entity';

@Injectable()
export class CasestudiesService {
  constructor(
    @InjectRepository(Casestudy)
    private casestudyRepository: Repository<Casestudy>,
  ) {}

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private normalizePayload<T extends Partial<CreateCasestudyDto>>(dto: T): T {
    const payload = { ...dto };

    // Synchronize stats & metrics
    if (payload.stats && !payload.metrics) {
      payload.metrics = payload.stats.map((s) => ({
        label: s.label || s.name,
        value: s.value || s.count,
        name: s.name || s.label,
        count: s.count || s.value,
      }));
    } else if (payload.metrics && !payload.stats) {
      payload.stats = payload.metrics.map((m) => ({
        name: m.name || m.label,
        count: m.count || m.value,
        label: m.label || m.name,
        value: m.value || m.count,
      }));
    }

    return payload;
  }

  async create(createCasestudyDto: CreateCasestudyDto): Promise<Casestudy> {
    const payload = this.normalizePayload(createCasestudyDto);

    // Auto-generate slug if omitted
    if (!payload.slug && payload.title) {
      const baseSlug = this.generateSlug(payload.title) || 'case-study';
      let slug = baseSlug;
      const existing = await this.casestudyRepository.findOne({ where: { slug } });
      if (existing) {
        slug = `${baseSlug}-${Date.now().toString(36)}`;
      }
      payload.slug = slug;
    }

    const casestudy = this.casestudyRepository.create(payload);
    return await this.casestudyRepository.save(casestudy);
  }

  async findAll(): Promise<Casestudy[]> {
    return await this.casestudyRepository.find({
      order: {
        order: 'ASC',
        createdAt: 'DESC',
      },
      relations: {
        category: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Casestudy> {
    const casestudy = await this.casestudyRepository.findOne({
      where: { slug },
      relations: { category: true },
    });
    if (!casestudy) {
      throw new NotFoundException(`Casestudy with slug '${slug}' not found`);
    }
    return casestudy;
  }

  async findOne(idOrSlug: string): Promise<Casestudy> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    let casestudy: Casestudy | null = null;
    if (isUuid) {
      casestudy = await this.casestudyRepository.findOne({
        where: { id: idOrSlug },
        relations: { category: true },
      });
    }
    if (!casestudy) {
      casestudy = await this.casestudyRepository.findOne({
        where: { slug: idOrSlug },
        relations: { category: true },
      });
    }
    if (!casestudy) {
      throw new NotFoundException(`Casestudy with ID or Slug '${idOrSlug}' not found`);
    }
    return casestudy;
  }

  async update(id: string, updateCasestudyDto: UpdateCasestudyDto): Promise<Casestudy> {
    const casestudy = await this.findOne(id);
    const payload = this.normalizePayload(updateCasestudyDto);
    Object.assign(casestudy, payload);
    return await this.casestudyRepository.save(casestudy);
  }

  async remove(id: string): Promise<void> {
    const casestudy = await this.findOne(id);
    await this.casestudyRepository.remove(casestudy);
  }
}
