import { Module } from "@nestjs/common";
import { StreetController } from "./street.controller";
import { PrismaService } from "src/database/prisma.service";
import { StreetService } from "./street.service";

@Module({
  imports: [],
  controllers: [StreetController],
  providers: [PrismaService, StreetService],
  exports: [StreetService]
})
export class StreetModule {}