import { Injectable } from "@nestjs/common";
import { StreetRepository } from "src/admin/street/repository/street-repository";
import { CreateStreetDto } from "src/admin/street/dtos/create-street-body";
import { ListStreetsDto } from "./dtos/list-streets-body";

@Injectable()
export class StreetService {

  constructor(private streetRepository: StreetRepository) {}

  async createStreet(
    createStreetDto: CreateStreetDto
  ) {
    const {name, neighborhood, qrcode_url, vacancies} = createStreetDto

    const streetWithSameQrCode = await this.streetRepository.findQrCode(qrcode_url)

    if (streetWithSameQrCode) {
      throw new Error('QrCode Already Exists')
    }

    const street = await this.streetRepository.create({
      name,
      neighborhood,
      qrcode_url,
      vacancies
    })

    return {
      street,
    }

  }

  async listStreets(
    listStreetsDto: ListStreetsDto
  ) {
    const { name, page } = listStreetsDto

    const streets = await this.streetRepository.searchMany(name, page)

    return {
      streets,
    }
  }
}