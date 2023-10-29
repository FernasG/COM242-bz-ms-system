import { Prisma, Street } from "@prisma/client";
import { StreetRepository } from "../street-repository";
import { PrismaService } from "src/database/prisma.service";
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaStreetRepository implements StreetRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.StreetCreateInput): Promise<Street | null> {
    return await this.prisma.street.create({
      data,
    })
  }

  async findQrCode(qrcode_url: string): Promise<Street | null> {
    const street = await this.prisma.street.findUnique({
      where: {
        qrcode_url,
      }
    })

    return street
  }

  async searchMany(query: string, page: number): Promise<Street[]> {
      const streets = await this.prisma.street.findMany({
        where: {
          name: {
            contains: query
          },
        },
        take: 10,
        skip: (page - 1) * 10,
      })

      return streets
  }

  async deleteStreet(id: string): Promise<Street | null> {
    return await this.prisma.street.delete({
      where: {
        id
      }
    })
  }
}