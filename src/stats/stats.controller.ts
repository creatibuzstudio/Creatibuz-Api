import { Controller, Get, Post, Patch, Put, Body, Req } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  getStats() {
    return this.statsService.getStats();
  }

  @Get('dashboard')
  getDashboardStats() {
    return this.statsService.getStats();
  }

  @Get('overview')
  getOverviewStats() {
    return this.statsService.getStats();
  }

  @Get('about')
  getAboutStats() {
    return this.statsService.getAboutStats();
  }

  @Patch('about')
  updateAboutStats(
    @Body()
    body: {
      projectDeliveries?: number;
      inHouseExperts?: number;
      satisfiedClients?: number;
      businessPartners?: number;
    },
  ) {
    return this.statsService.updateAboutStats(body);
  }

  @Put('about')
  putAboutStats(
    @Body()
    body: {
      projectDeliveries?: number;
      inHouseExperts?: number;
      satisfiedClients?: number;
      businessPartners?: number;
    },
  ) {
    return this.statsService.updateAboutStats(body);
  }

  @Post('track-visit')
  trackVisit(
    @Req() req: any,
    @Body()
    body: {
      path?: string;
      eventType?: string;
      blogSlug?: string;
    },
  ) {
    const ipAddress =
      req.headers?.['x-forwarded-for'] ||
      req.socket?.remoteAddress ||
      '127.0.0.1';
    const userAgent = req.headers?.['user-agent'] || 'Web Browser';

    return this.statsService.trackVisit({
      ipAddress: String(ipAddress).split(',')[0].trim(),
      userAgent: String(userAgent),
      pagePath: body?.path || '/',
      eventType: body?.eventType || (body?.blogSlug ? 'BLOG_VIEW' : 'PAGE_VIEW'),
      blogSlug: body?.blogSlug,
    });
  }
}
