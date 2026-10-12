import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

let cachedApp: NestExpressApplication;

export async function getApp() {
  if (!cachedApp) {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
      origin: true,
      credentials: true,
    });

    await app.init();
    cachedApp = app;
  }
  return cachedApp;
}
