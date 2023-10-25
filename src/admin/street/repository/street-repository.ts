import { Prisma, Street } from "@prisma/client";

export abstract class StreetRepository {
  abstract create(data: Prisma.StreetCreateInput): Promise<Street | null>
  abstract findQrCode(qrcode_url: string): Promise<Street | null>
}