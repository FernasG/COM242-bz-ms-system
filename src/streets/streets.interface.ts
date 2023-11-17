export class CreateStreetDto {
  name: string
  neighborhood: string
  qrcode_url: string
  vacancies: number
}

export class UpdateStreetDto {
  id: string
  name: string
  neighborhood: string
  qrcode_url: string
  vacancies: number
}