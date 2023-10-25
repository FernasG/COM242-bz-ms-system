import { Prisma, Street } from "@prisma/client";
import { StreetRepository } from "../street-repository";
import { PrismaService } from "src/database/prisma.service";

export class PrismaStreetRepository implements StreetRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StreetCreateInput): Promise<Street | null> {
    const street = await this.prisma.street.create({
      data,
    })

    return street
  }

  async findQrCode(qrcode_url: string): Promise<Street | null> {
    const street = await this.prisma.street.findUnique({
      where: {
        qrcode_url,
      }
    })

    return street
  }

}