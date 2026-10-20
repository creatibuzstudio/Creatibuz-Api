import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { Blog } from './entities/blog.entity';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private blogRepository: Repository<Blog>,
  ) {}

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private normalizeMetadata<T extends Partial<CreateBlogDto>>(dto: T): T {
    const payload = { ...dto };

    // Synchronize shortDescription and excerpt
    if (payload.shortDescription && !payload.excerpt) {
      payload.excerpt = payload.shortDescription;
    } else if (payload.excerpt && !payload.shortDescription) {
      payload.shortDescription = payload.excerpt;
    }

    // Synchronize SEO Title & Meta Title
    const titleVal = payload.seoTitle || payload.metaTitle;
    if (titleVal) {
      payload.seoTitle = payload.seoTitle || titleVal;
      payload.metaTitle = payload.metaTitle || titleVal;
    }

    // Synchronize SEO Description & Meta Description
    const descVal = payload.seoDescription || payload.metaDescription;
    if (descVal) {
      payload.seoDescription = payload.seoDescription || descVal;
      payload.metaDescription = payload.metaDescription || descVal;
    }

    // Synchronize Keywords (seoKeywords, metaKeywords, keywords)
    const keywordsVal = payload.seoKeywords || payload.keywords || payload.metaKeywords;
    if (keywordsVal) {
      payload.seoKeywords = payload.seoKeywords || keywordsVal;
      payload.keywords = payload.keywords || keywordsVal;
      payload.metaKeywords = payload.metaKeywords || keywordsVal;
    }

    return payload;
  }

  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const payload = this.normalizeMetadata(createBlogDto);

    // Auto-generate slug if omitted
    if (!payload.slug) {
      const baseSlug = this.generateSlug(payload.title) || 'blog-post';
      let slug = baseSlug;
      const existing = await this.blogRepository.findOne({ where: { slug } });
      if (existing) {
        slug = `${baseSlug}-${Date.now().toString(36)}`;
      }
      payload.slug = slug;
    }

    const blog = this.blogRepository.create(payload);
    return await this.blogRepository.save(blog);
  }

  async findAll(): Promise<Blog[]> {
    return await this.blogRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogRepository.findOne({ where: { slug } });
    if (!blog) {
      throw new NotFoundException(`Blog with slug '${slug}' not found`);
    }
    // Increment view count when a visitor reads the blog
    blog.views = (Number(blog.views) || 0) + 1;
    await this.blogRepository.save(blog);
    return blog;
  }

  async incrementViews(idOrSlug: string): Promise<Blog> {
    const blog = await this.findOne(idOrSlug);
    blog.views = (Number(blog.views) || 0) + 1;
    return await this.blogRepository.save(blog);
  }

  async findOne(idOrSlug: string): Promise<Blog> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
    let blog: Blog | null = null;
    if (isUuid) {
      blog = await this.blogRepository.findOne({ where: { id: idOrSlug } });
    }
    if (!blog) {
      blog = await this.blogRepository.findOne({ where: { slug: idOrSlug } });
    }
    if (!blog) {
      throw new NotFoundException(`Blog with ID or Slug '${idOrSlug}' not found`);
    }
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    const payload = this.normalizeMetadata(updateBlogDto);
    const updated = Object.assign(blog, payload);
    return await this.blogRepository.save(updated);
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogRepository.remove(blog);
  }
}
