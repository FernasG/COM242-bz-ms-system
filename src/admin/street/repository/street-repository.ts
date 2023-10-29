import { Prisma, Street } from "@prisma/client";

export abstract class StreetRepository {
  abstract create(data: Prisma.StreetCreateInput): Promise<Street | null>
  abstract findQrCode(qrcode_url: string): Promise<Street | null>
  abstract searchMany(query: string, page: number): Promise<Street[]>
  abstract update(data: Prisma.StreetUpdateInput): Promise<Street | null>
  abstract deleteStreet(id: string): Promise<Street | null>
}