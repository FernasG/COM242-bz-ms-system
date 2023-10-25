import { IsNotEmpty, Length } from "class-validator"

export class CreateStreetDto {
  @IsNotEmpty()
  @Length(5, 200)
  name: string
  
  @IsNotEmpty()
  @Length(5, 30)
  neighborhood: string
  
  @IsNotEmpty()
  qrcode_url: string
  
  @IsNotEmpty()
  vacancies: number
}