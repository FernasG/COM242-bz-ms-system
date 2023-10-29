import { IsNotEmpty, IsEmpty } from "class-validator"

export class ListStreetsDto {
  @IsEmpty()
  name: string
  
  @IsNotEmpty()
  page: number
}