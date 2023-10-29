import { IsNotEmpty, IsOptional } from "class-validator"

export class ListStreetsDto {
  @IsOptional()
  name: string
  
  @IsNotEmpty()
  page: number
}