import { Controller } from "@nestjs/common";
import { ParkingSessionsService } from "./parkingSessions.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateParkingSessionDto, FinishParkingSessionDto, UpdateParkingSessionDto } from "./parkingSessions.interface";

@Controller()
export class ParkingSessionsController {
  constructor(private readonly parkingSessionsService: ParkingSessionsService) {}

  @MessagePattern('createParkingSession')
  async create(@Payload() createParkingSessionDto:CreateParkingSessionDto) {
    return this.parkingSessionsService.create(createParkingSessionDto)
  }

  @MessagePattern('listAllActivesParkingSessionsByStreet')
  async listAllActivesParkingSessionsByStreet(@Payload('street_id') street_id: string) {
    return this.parkingSessionsService.listAllActivesByStreet(street_id)
  }

  @MessagePattern('updateParkingSessionInfos')
  async updateParkingSessionInfos(@Payload() updateParkingSessionDto: UpdateParkingSessionDto) {
    return this.parkingSessionsService.updateParkingSessionInfos(updateParkingSessionDto)
  }

  @MessagePattern('finishParkingSession')
  async finishParkingSession(@Payload() finishParkingSessionDto: FinishParkingSessionDto) {
    return this.parkingSessionsService.finishParkingSession(finishParkingSessionDto)
  }
}