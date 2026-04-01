import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { env } from './config/env';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefijo global
  app.setGlobalPrefix('api/v1');

  // Validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Filtros de excepción e interceptores globales
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  // CORS
  app.enableCors();

  const port = env.PORT;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}/api/v1`);
}
bootstrap();
