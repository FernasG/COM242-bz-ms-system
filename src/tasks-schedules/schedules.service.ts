import { PrismaService } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ParkingSessionsService } from 'src/parking-sessions/parkingSessions.service';

@Injectable()
export class ScheduleService {
  private readonly logger = new Logger(ScheduleService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly parkingSessionService: ParkingSessionsService
  ) { }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  protected async handleGameficationPoints() {
    const { register, name } = await this.prismaService.user.findFirst({
      select: { register: true, name: true },
      orderBy: { points_gamefication: 'desc' }
    });

    this.prismaService.$transaction([
      this.prismaService.user.update({
        where: { register },
        data: { balance: { increment: this.parkingSessionService.hourPrice } }
      }),
      this.prismaService.user.updateMany({ data: { points_gamefication: 0 } })
    ])

    this.logger.log(`Usuário de nome: ${name} e registro: ${register}, foi o que obteve o melhor desempenho no mês anterior`);
    this.logger.log(`Pontos de gameificação foram zerados`);
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  protected async rebalanceStreetParkingPrice() {
    this.logger.log({ message: 'Rebalancing Street Parking Price', date: new Date() });
    const [startDate, endDate] = [new Date(), new Date()];

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 59);

    const parkingSessions = await this.prismaService.parking_Session
      .findMany({ where: { created_at: { gte: startDate, lte: endDate } } });

    if (!parkingSessions.length) return null;

    const groupStreetSessions = parkingSessions.reduce<{ [x: string]: { count: number; } }>((acc, current) => {
      if (Object.keys(acc).includes(current.street_id)) acc[current.street_id].count += 1;
      else acc[current.street_id] = { count: 1 };

      return acc;
    }, {});

    const streetsPriceSum = Object.keys(groupStreetSessions).length * 3;
    const parkingSessionsTotal = parkingSessions.length;

    const streetsNewPricing = Object.entries(groupStreetSessions).reduce<{ street_id: string; price: number; }[]>((acc, current) => {
      const [streetId, value] = current;
      const percentage = value.count / parkingSessionsTotal;
      const newPrice = streetsPriceSum * percentage;
      acc.push({ street_id: streetId, price: newPrice });

      return acc;
    }, []);

    this.prismaService.$transaction(
      streetsNewPricing.map(({ street_id, price }) =>
        this.prismaService.street.update({ where: { id: street_id }, data: { hour_price: price } })
      )
    );

    this.logger.log({ message: 'Finalizing Rebalance Street Parking Price', date: new Date() });
  }
}
