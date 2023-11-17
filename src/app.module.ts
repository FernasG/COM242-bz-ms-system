import { Module } from '@nestjs/common';
import { StreetModule } from './streets/streets.module';
import { PrismaModule } from './database/prisma.module';
import { UsersModule } from './users/users.module';
import { VeichlesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    PrismaModule,
    StreetModule,
    UsersModule,
    VeichlesModule
  ]
})
export class AppModule { }
