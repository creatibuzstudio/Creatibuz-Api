import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Add this to enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'https://www.jevxo.com', 'https://jevxo.com'],
    credentials: true,
  });

  const port = process.env.PORT ?? 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
