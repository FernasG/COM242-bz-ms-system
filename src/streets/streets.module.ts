import { Module } from "@nestjs/common";
import { StreetsController } from "./streets.controller";
import { StreetsService } from "./streets.service";

@Module({
  imports: [],
  controllers: [StreetsController],
})
export class StreetModule { }