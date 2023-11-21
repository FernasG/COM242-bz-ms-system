export class CreateStreetDto {
  name: string
  neighborhood: string
  qrcode_url: string
  vacancies: number
  latitude: string
  longitude: string
}

export class UpdateStreetDto {
  id: string
  name: string
  neighborhood: string
  qrcode_url: string
  vacancies: number
  latitude: string
  longitude: string
}