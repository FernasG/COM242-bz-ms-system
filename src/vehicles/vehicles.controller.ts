import { Controller, UseFilters } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { HttpExceptionFilter } from "src/exceptions/http-exception.filter";
import { CreateVehiclesDto, UpdateVehiclesDto } from "./vehicles.interface";
import { VehiclesService } from "./veichles.service";

@Controller()
@UseFilters(HttpExceptionFilter)
export class VeichlesController {

  constructor(private readonly vehicleService: VehiclesService) { }

  @MessagePattern('createVeichle')
  public async create(@Payload() createVehiclesDto: CreateVehiclesDto) {
    return this.vehicleService.create(createVehiclesDto);
  }
  
  @MessagePattern('findAllUserVeichles')
  public async findAll(@Payload('user_id') user_id: string) {
    return this.vehicleService.findAllUserVeichles(user_id);
  }
  
  @MessagePattern('updateVeichle')
  public async update(@Payload() updateVehiclesDto: UpdateVehiclesDto) {
    return this.vehicleService.update(updateVehiclesDto);
  }
  
  @MessagePattern('removeVeichle')
  public async remove(@Payload('id') id: string) {
    return this.vehicleService.remove(id);
  }
}