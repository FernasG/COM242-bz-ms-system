import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateStreetDto, UpdateStreetDto } from "./streets.interface";
import { PrismaService } from "@database";
import { UploadsService } from "src/uploads/uploads.service";

@Injectable()
export class StreetsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly uploadsService: UploadsService
  ) { }

  public async createStreet(
    createStreetDto: CreateStreetDto,
    file: any
  ) {
    const { name, neighborhood, vacancies, latitude, longitude } = createStreetDto

    let { qrcode_url } = createStreetDto

    const data = { name, neighborhood, vacancies, latitude, longitude };
    const street = await this.prismaService.street.create({ data })

    if (!street) throw new InternalServerErrorException('Failed to register your street.');

    qrcode_url += '\\' + street.id

    const updatedStreet = await this.prismaService.street.update({where: {id: street.id}, data: {qrcode_url}})

    if (!updatedStreet) throw new InternalServerErrorException('Failed to insert your qrcode_url.');

    const uploadQrCode = await this.uploadsService.handleFile(file, (name+neighborhood));

    if (!uploadQrCode) throw new InternalServerErrorException('Failed to upload your file.');

    return updatedStreet;
  }

  public async findAllStreets() {
    return await this.prismaService.street.findMany();
  }
  
  public async findStreet(id: string) {
    return await this.prismaService.street.findFirst({where: {id}});
  }

  public async update(updateStreetDto: UpdateStreetDto) {
    const { id, name, neighborhood, qrcode_url, vacancies, latitude, longitude } = updateStreetDto

    const streetExists = await this.prismaService.street.findFirst({ where: { id } })

    if (!streetExists) throw new NotFoundException('Street not found.');

    const data: Partial<UpdateStreetDto> = {};

    if (name) data.name = name;
    if (neighborhood) data.neighborhood = neighborhood;
    if (qrcode_url) data.qrcode_url = qrcode_url;
    if (vacancies) data.vacancies = vacancies;
    if (longitude) data.longitude = longitude;
    if (latitude) data.latitude = latitude;

    return this.prismaService.street.update({ where: { id }, data });
  }

  public async remove(id: string) {
    const streetExists = await this.prismaService.street.findFirst({ where: { id } })

    if (!streetExists) throw new NotFoundException('Street not found.');

    return this.prismaService.street.delete({ where: { id } });
  }
}