export class CreateVehiclesDto {
  plate: string
  model: string
  color: string
  manufacturer: string
  user_id: string
}

export class UpdateVehiclesDto {
  id: string
  plate?: string
  model?: string
  color?: string
  manufacturer?: string
}