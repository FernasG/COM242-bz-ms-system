import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

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

  app.useGlobalPipes(new ValidationPipe())

  await app.listen();
}
bootstrap();
