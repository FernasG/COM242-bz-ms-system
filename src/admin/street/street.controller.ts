import { Body, Controller, Post } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateStreetDto } from "src/admin/street/dtos/create-street-body";
import { StreetService } from "./street.service";

@Controller('street')
export class StreetController {
  constructor(
    private prisma: PrismaService,
    private readonly streetService: StreetService,
  ) {}

  @Post('create')
  async createStreet(@Body() createStreetBody: CreateStreetDto) {
    // const {name, neighborhood, qrcode_url, vacancies} = body

    // const street = await this.prisma.street.create({
    //   data: {
    //     id: randomUUID(),
    //     name,
    //     neighborhood,
    //     qrcode_url,
    //     vacancies,
        
    //   }
    // })

    return this.streetService.createStreet(createStreetBody)
  }
}