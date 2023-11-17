import { Module } from "@nestjs/common";
import { VeichlesController } from "./vehicles.controller";
import { UsersService } from "src/users/users.service";
import { VehiclesService } from "./veichles.service";

@Module({
  controllers: [VeichlesController],
  providers: [VehiclesService]
})
export class VeichlesModule {}