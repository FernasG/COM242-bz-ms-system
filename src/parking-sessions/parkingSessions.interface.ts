export class CreateParkingSessionDto {
  hours: number;
  entry_time: Date
  street_id: string
  vehicle_id: string
}

export class UpdateParkingSessionDto {
  parking_session_id: string
  street_id?: string
  vehicle_id?: string
}

export class FinishParkingSessionDto {
  parking_session_id: string
  time?: Date
}