import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedApp: NestExpressApplication;

export async function getApp() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Disable ETag generation to prevent 304 responses missing CORS headers
    app.set('etag', false);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.use((_req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      next();
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}
