import { Controller } from "@nestjs/common";
import { CreateStreetDto } from "src/admin/street/dtos/create-street-body";
import { StreetService } from "./street.service";
import { ListStreetsDto } from "./dtos/list-streets-body";
import { DeleteStreetDto } from "./dtos/delete-street-body";
import { UpdateStreetDto } from "./dtos/update-street-body";
import { MessagePattern, Payload } from "@nestjs/microservices";

@Controller()
export class StreetController {
  constructor(private readonly streetService: StreetService) { }

  @MessagePattern('createStreet')
  async createStreet(@Payload() createStreetBody: CreateStreetDto) {
    return this.streetService.createStreet(createStreetBody)
  }

  @MessagePattern('listStreets')
  async listStreets(@Payload() listStreetBody: ListStreetsDto) {
    return this.streetService.listStreets(listStreetBody)
  }

  @MessagePattern('updateStreet')
  async updateStreet(@Payload() updateStreetBody: UpdateStreetDto) {
    return this.streetService.updateStreet(updateStreetBody)
  }

  @MessagePattern('deleteStreet')
  async deleteStreet(@Payload() deleteStreetBody: DeleteStreetDto) {
    return this.streetService.deleteStreet(deleteStreetBody)
  }
}