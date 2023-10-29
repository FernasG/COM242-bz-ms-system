import { Body, Controller, Post, Get, Delete } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStreetDto } from "src/admin/street/dtos/create-street-body";
import { StreetService } from "./street.service";
import { ListStreetsDto } from "./dtos/list-streets-body";
import { DeleteStreetDto } from "./dtos/delete-street-body";

@Controller('street')
export class StreetController {
  constructor(
    private prisma: PrismaService,
    private readonly streetService: StreetService,
  ) {}

  @Post('create')
  async createStreet(@Body() createStreetBody: CreateStreetDto) {

    return this.streetService.createStreet(createStreetBody)
  }

  @Get('list')
  async listStreets(@Body() listStreetBody: ListStreetsDto) {

    return this.streetService.listStreets(listStreetBody)
  }

  @Delete('delete')
  async deleteStreet(@Body() deleteStreetBody: DeleteStreetDto) {

    return this.streetService.deleteStreet(deleteStreetBody)
  }
}