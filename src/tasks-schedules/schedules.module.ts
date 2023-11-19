import { Module } from "@nestjs/common";
import { ScheduleService } from "./schedules.service";
import { ParkingSessionsService } from "src/parking-sessions/parkingSessions.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ScheduleService, ParkingSessionsService]
})
export class SchedulesModule {}