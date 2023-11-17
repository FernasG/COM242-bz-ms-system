import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@database";
import { UsersService } from "src/users/users.service";
import { CreateVehiclesDto, UpdateVehiclesDto } from "./vehicles.interface";

@Injectable()
export class VehiclesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService
  ) { }

  public async create(createVeichleDto: CreateVehiclesDto) {
    const { color, manufacturer, model, plate, user_id } = createVeichleDto;

    const vehicleAlreadyExists = await this.prismaService.vehicle.findFirst({ where: { plate } })

    if (vehicleAlreadyExists) throw new BadRequestException('An vehicle with these plate already exists.');

    await this.userService.findOne(user_id)

    const data = { color, manufacturer, model, plate, user_id };
    const vehicle = await this.prismaService.vehicle.create({ data })

    if (!vehicle) throw new InternalServerErrorException('Failed to register your vehicle.');

    return vehicle;
  }

  public async findAllUserVeichles(user_id: string) {
    await this.userService.findOne(user_id);

    const vehicles = this.prismaService.vehicle.findMany({ where: { user_id } })

    if (!vehicles) throw new InternalServerErrorException('Failed to find your vehicles.');

    return vehicles;
  }

  public async update(updateVehiclesDto: UpdateVehiclesDto) {
    const { id, color, manufacturer, model, plate } = updateVehiclesDto;

    const vehicleExists = await this.prismaService.vehicle.findFirst({ where: { id } })

    if (!vehicleExists) throw new NotFoundException('Vehicle not found.');

    const data: Partial<UpdateVehiclesDto> = {};

    if (color) data.color = color;
    if (manufacturer) data.manufacturer = manufacturer;
    if (model) data.model = model;
    if (plate) data.plate = plate;

    return this.prismaService.vehicle.update({ where: { id }, data });

  }

  public async remove(id: string) {
    const vehicleExists = await this.prismaService.vehicle.findFirst({ where: { id } })

    if (!vehicleExists) throw new NotFoundException('Vehicle not found.');

    return this.prismaService.vehicle.delete({ where: { id } });
  }
}