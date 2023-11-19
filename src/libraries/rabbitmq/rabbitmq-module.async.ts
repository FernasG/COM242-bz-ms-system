import { ConfigService } from '@nestjs/config';
import { ClientsModuleAsyncOptions, Transport } from '@nestjs/microservices';

export const RabbitMQModuleAsync = ((): ClientsModuleAsyncOptions => {
  return [
    {
      name: 'NOTIFICATIONS_SERVICE',
      inject: [ConfigService],
      useFactory: ((configService: ConfigService) => ({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('rabbitmq_url')],
          queue: 'notifications_queue',
          queueOptions: { durable: true }
        }
      }))
    }
  ];
});