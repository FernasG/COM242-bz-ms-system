import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { StreetModule } from './streets/streets.module';
import { PrismaModule } from './database/prisma.module';
import { VeichlesModule } from './vehicles/vehicles.module';
import { SchedulesModule } from './tasks-schedules/schedules.module';
import { ParkingSessionsModule } from './parking-sessions/parkingSessions.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    UsersModule,
    PrismaModule,
    StreetModule,
    VeichlesModule,
    SchedulesModule,
    ParkingSessionsModule
  ]
})
export class AppModule { }
