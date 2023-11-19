import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RabbitMQModuleAsync } from '@libraries';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [ClientsModule.registerAsync(RabbitMQModuleAsync())],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }
