import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { ScheduleService } from "./schedules.service";
import { ParkingSessionsService } from "src/parking-sessions/parkingSessions.service";

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [ScheduleService, ParkingSessionsService]
})
export class SchedulesModule { }