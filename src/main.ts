import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Strip properties that do not have any decorators in the DTO (whitelist)
  // and automatically transform payloads to DTO instances.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true, // set to true to throw on extra props
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
