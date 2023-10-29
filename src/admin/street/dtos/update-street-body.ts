import { IsNotEmpty, IsOptional, Length } from "class-validator"

export class UpdateStreetDto {
  @IsNotEmpty()
  id: string
  
  @IsOptional()
  @Length(5, 200)
  name: string
  
  @IsOptional()
  @Length(5, 30)
  neighborhood: string

  @IsOptional()
  qrcode_url: string

  @IsOptional()
  vacancies: number
}