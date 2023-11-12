import { Module } from '@nestjs/common';
import { StreetModule } from './admin/street/street.module';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    PrismaModule,
    StreetModule,
    UsersModule
  ]
})
export class AppModule { }
