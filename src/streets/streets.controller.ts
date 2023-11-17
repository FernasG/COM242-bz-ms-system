import { Controller } from "@nestjs/common";
import { StreetsService } from "./streets.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateStreetDto, UpdateStreetDto } from "./streets.interface";

@Controller()
export class StreetsController {
  constructor(private readonly streetsService: StreetsService) { }

  @MessagePattern('createStreet')
  async createStreet(@Payload() createStreetDto: CreateStreetDto) {
    return this.streetsService.createStreet(createStreetDto)
  }

  @MessagePattern('findAllStreets')
  async findAllStreets() {
    return this.streetsService.findAllStreets()
  }

  @MessagePattern('updateStreet')
  async updateStreet(@Payload() updateStreetDto: UpdateStreetDto) {
    return this.streetsService.update(updateStreetDto)
  }

  @MessagePattern('deleteStreet')
  async deleteStreet(@Payload('id') id: string) {
    return this.streetsService.remove(id)
  }
}