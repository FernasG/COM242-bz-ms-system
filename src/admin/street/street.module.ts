import { Module } from "@nestjs/common";
import { StreetController } from "./street.controller";
import { StreetService } from "./street.service";
import { StreetRepository } from "./repository/street-repository";
import { PrismaStreetRepository } from "./repository/prisma/prisma-street-repository";

@Module({
  imports: [],
  controllers: [StreetController],
  providers: [
    StreetService,
    {
      provide: StreetRepository,
      useClass: PrismaStreetRepository
    }
  ],
})
export class StreetModule { }