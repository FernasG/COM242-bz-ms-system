import { IsNotEmpty } from "class-validator"

export class DeleteStreetDto {
  @IsNotEmpty()
  id: string
}