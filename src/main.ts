import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { AppModule } from './app.module';

async function bootstrap() {
  const RABBITMQ_URL = process.env.RABBITMQ_URL;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [RABBITMQ_URL],
      queue: 'system_queue',
      queueOptions: { durable: false }
    }
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.listen();
}
bootstrap();
