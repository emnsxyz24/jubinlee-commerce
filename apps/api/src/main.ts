import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SimpleRateLimitGuard } from './common/guards/rate-limit.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const instance = app.getHttpAdapter().getInstance();
  if (instance && typeof instance.set === 'function') {
    instance.set('trust proxy', true);
  }

  const envCors = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((s) => s.trim())
    : [];

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://jubinlee.mikaeru.my.id',
    'https://jubinleeadmin.mikaeru.my.id',
    process.env.STOREFRONT_URL,
    process.env.ADMIN_URL,
    ...envCors,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      if (!origin) return callback(null, true);

      const isAllowedDomain =
        allowedOrigins.some((allowed) => origin === allowed || origin.startsWith(allowed)) ||
        /(\.mikaeru\.my\.id|^https:\/\/mikaeru\.my\.id)$/.test(origin) ||
        /(\.pages\.dev|\.vercel\.app|\.onrender\.com|\.devtunnels\.ms|\.ngrok-free\.app|\.loca\.lt|\.trycloudflare\.com)(:\d+)?$/.test(origin) ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');

      if (isAllowedDomain || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-Guest-Token'],
    optionsSuccessStatus: 204,
  });

  app.use(cookieParser());

  app.useGlobalGuards(new SimpleRateLimitGuard());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  if (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SWAGGER === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Fashion E-Commerce API')
      .setDescription('REST API contract for storefront and admin panel')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`API is running on port: ${port}`);
}
bootstrap();
