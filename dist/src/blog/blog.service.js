"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const blog_entity_1 = require("./entities/blog.entity");
let BlogService = class BlogService {
    constructor(blogRepository) {
        this.blogRepository = blogRepository;
    }
    generateSlug(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    normalizeMetadata(dto) {
        const payload = { ...dto };
        if (payload.shortDescription && !payload.excerpt) {
            payload.excerpt = payload.shortDescription;
        }
        else if (payload.excerpt && !payload.shortDescription) {
            payload.shortDescription = payload.excerpt;
        }
        const titleVal = payload.seoTitle || payload.metaTitle;
        if (titleVal) {
            payload.seoTitle = payload.seoTitle || titleVal;
            payload.metaTitle = payload.metaTitle || titleVal;
        }
        const descVal = payload.seoDescription || payload.metaDescription;
        if (descVal) {
            payload.seoDescription = payload.seoDescription || descVal;
            payload.metaDescription = payload.metaDescription || descVal;
        }
        const keywordsVal = payload.seoKeywords || payload.keywords || payload.metaKeywords;
        if (keywordsVal) {
            payload.seoKeywords = payload.seoKeywords || keywordsVal;
            payload.keywords = payload.keywords || keywordsVal;
            payload.metaKeywords = payload.metaKeywords || keywordsVal;
        }
        return payload;
    }
    async create(createBlogDto) {
        const payload = this.normalizeMetadata(createBlogDto);
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
    async findAll() {
        return await this.blogRepository.find({
            order: {
                createdAt: 'DESC',
            },
        });
    }
    async findBySlug(slug) {
        const blog = await this.blogRepository.findOne({ where: { slug } });
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with slug '${slug}' not found`);
        }
        blog.views = (Number(blog.views) || 0) + 1;
        await this.blogRepository.save(blog);
        return blog;
    }
    async incrementViews(idOrSlug) {
        const blog = await this.findOne(idOrSlug);
        blog.views = (Number(blog.views) || 0) + 1;
        return await this.blogRepository.save(blog);
    }
    async findOne(idOrSlug) {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(idOrSlug);
        let blog = null;
        if (isUuid) {
            blog = await this.blogRepository.findOne({ where: { id: idOrSlug } });
        }
        if (!blog) {
            blog = await this.blogRepository.findOne({ where: { slug: idOrSlug } });
        }
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID or Slug '${idOrSlug}' not found`);
        }
        return blog;
    }
    async update(id, updateBlogDto) {
        const blog = await this.findOne(id);
        const payload = this.normalizeMetadata(updateBlogDto);
        const updated = Object.assign(blog, payload);
        return await this.blogRepository.save(updated);
    }
    async remove(id) {
        const blog = await this.findOne(id);
        await this.blogRepository.remove(blog);
    }
};
exports.BlogService = BlogService;
exports.BlogService = BlogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(blog_entity_1.Blog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BlogService);
//# sourceMappingURL=blog.service.js.map