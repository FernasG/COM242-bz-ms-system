import { Module } from "@nestjs/common";
import { ParkingSessionsController } from "./parkingSessions.controller";
import { ParkingSessionsService } from "./parkingSessions.service";

@Module({
  controllers: [ParkingSessionsController],
  providers: [ParkingSessionsService]
})
export class ParkingSessionsModule { }