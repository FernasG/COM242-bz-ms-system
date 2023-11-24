import { PrismaService } from "@database";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateParkingSessionDto, FinishParkingSessionDto, UpdateParkingSessionDto } from "./parkingSessions.interface";

@Injectable()
export class ParkingSessionsService {
  public readonly hourPrice: number
  public readonly scoreMultiplier: number

  constructor(private readonly prismaService: PrismaService) {
    this.hourPrice = 3;
    this.scoreMultiplier = 0.5;
  }

  public async create(createParkingSessionDto: CreateParkingSessionDto) {
    const { entry_time, vehicle_id, street_id, hours } = createParkingSessionDto;

    const vehicle = await this.prismaService.vehicle.findUnique({ where: { id: vehicle_id } });

    if (!vehicle) throw new NotFoundException('That car does not exists')

    const street = await this.prismaService.street.findUnique({ where: { id: street_id } });

    if (!street) throw new NotFoundException('That street does not exists')

    if (street.vacancies === 0) throw new BadRequestException('That street there is not more vacancies')

    const vehicleAlreadyParked = await this.prismaService.parking_Session.findFirst({ where: { vehicle_id, hours: null } });
    if (vehicleAlreadyParked) throw new BadRequestException('That car is already parked');

    const { hour_price } = street;
    const data = { entry_time, vehicle_id, street_id, hours, hour_price, total_price: hour_price * hours };

    const [parkingSession, vacancies] = await this.prismaService.$transaction([
      this.prismaService.parking_Session.create({ data }),
      this.prismaService.street.update({ where: { id: street_id }, data: { vacancies: street.vacancies - 1 } })
    ])

    return parkingSession;
  }

  public async listAllActivesByStreet(street_id: string) {
    const streetExists = await this.prismaService.street.findFirst({ where: { id: street_id } })

    if (!streetExists) throw new NotFoundException('That street does not exists')

    const parkingSessions = await this.prismaService.parking_Session.findMany({ where: { street_id, hours: null } })

    return parkingSessions
  }

  public async updateParkingSessionInfos(updateParkingSessionDto: UpdateParkingSessionDto) {
    const { parking_session_id, street_id, vehicle_id } = updateParkingSessionDto;

    const parkingSession = await this.prismaService.parking_Session.findUnique({ where: { id: parking_session_id } });

    if (!parkingSession) throw new NotFoundException('Parking Session not found.');

    const street = await this.prismaService.street.findUnique({ where: { id: street_id } });

    if (!street) throw new NotFoundException('Street not found.');

    const vehicle = await this.prismaService.vehicle.findUnique({ where: { id: vehicle_id } });

    if (!vehicle) throw new NotFoundException('Vehicle not found.');

    const data: Partial<UpdateParkingSessionDto> = {};

    if (street_id) data.street_id = street_id;
    if (vehicle_id) data.vehicle_id = vehicle_id;

    return this.prismaService.parking_Session.update({ where: { id: parking_session_id }, data });
  }

  public async finishParkingSession(finishParkingSessionDto: FinishParkingSessionDto) {
    const { parking_session_id, time } = finishParkingSessionDto;

    const parkingSession = await this.prismaService.parking_Session.findUnique({ select: { street_id: true, entry_time: true }, where: { id: parking_session_id } });

    if (!parkingSession) throw new NotFoundException('Parking Session not found.');

    const newDateTime = new Date(time);

    const timeAjusted = await this.ajustTimeByDay(newDateTime);

    const hours = await this.calcHoursDiff(parkingSession.entry_time, timeAjusted)

    const id = await this.getUserId(parking_session_id)

    const userIsInBlacklist = await this.userIsInBlacklist(id)


    const points = await this.calcGameficationPoints(hours, userIsInBlacklist)

    const { street_id } = await this.prismaService.parking_Session.findFirst({ where: { id: parking_session_id } })

    const finish = await this.prismaService.parking_Session.update({ where: { id: parking_session_id }, data: { hours, total_price: hours * this.hourPrice } })
    await this.prismaService.street.update({ where: { id: street_id }, data: { vacancies: { increment: 1 } } })
    const { points_gamefication } = await this.prismaService.user.update({ where: { id }, data: { points_gamefication: { increment: points } } })

    return {
      finish,
      points_gamefication
    }
  }

  private async ajustTimeByDay(date: Date): Promise<Date> {
    const dayOfWeek = date.getDay();
    const hours = date.getHours();

    if (dayOfWeek >= 1 && dayOfWeek <= 5 && hours > 17) {
      // Caso1: Segunda a sexta-feira, e o date2 seja maior que 17h
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 17, 0, 0);
    }

    if (dayOfWeek === 6 && hours > 13) {
      // Caso2: Sábado e o date2 seja maior que 13h
      return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0);
    }

    if (dayOfWeek === 0) {
      const saturday = this.adjustIfSunday(date)

      return saturday;
    }

    // Caso padrão: não há ajuste necessário
    return date;
  }

  private async adjustIfSunday(date: Date): Promise<Date> {
    if (date.getDay() === 0) {
      // Se a data for um domingo
      const sabadoAnterior = new Date(date);
      sabadoAnterior.setDate(date.getDate() - 1); // Vai para o sábado anterior
      sabadoAnterior.setHours(13, 0, 0, 0); // Define a hora para 13:00:00

      return sabadoAnterior;
    }

    // Se a data não for um domingo, retorna a data original
    return date;
  }

  private async calcHoursDiff(date1: Date, date2: Date): Promise<number> {
    // Convertendo as datas para UTC (se os timestamps forem armazenados em UTC no banco de dados)
    const data1UTC = new Date(date1.toISOString());
    const data2UTC = new Date(date2.toISOString());

    const diferencaEmMilissegundos = Math.abs(data2UTC.getTime() - data1UTC.getTime());
    const diferencaEmHorasDecimal = diferencaEmMilissegundos / (1000 * 60 * 60);

    return diferencaEmHorasDecimal;
  }

  private async calcGameficationPoints(hours: number, validator: boolean): Promise<number> {
    let points = 0

    if(!validator) {
      points = (1 + hours * this.scoreMultiplier)
    } else {
      points = 1
    }

    return points;
  }

  private async getUserId(pkSessionId: string) {
    const userId = await this.prismaService.parking_Session.findFirst({
      select: {
        vehicle: {
          select: {
            user: {
              select: {
                id: true
              }
            }
          }
        }
      },
      where: {
        id: pkSessionId
      }
    })

    return userId.vehicle.user.id;
  }

  private async userIsInBlacklist(user_id: string) {
    const userIsInBlacklist = await this.prismaService.blacklist.findFirst({
      where: {
        user_id,
      }
    })

    return (userIsInBlacklist) ? true : false
  }
}
