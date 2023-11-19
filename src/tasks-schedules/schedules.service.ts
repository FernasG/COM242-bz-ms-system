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

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT )
  protected async handleGameficationPoints() {
    const { register, name } = await this.prismaService.user.findFirst({
      select: {
        register: true,
        name: true
      },
      orderBy: {
        points_gamefication: 'desc'
      }
    })

    this.prismaService.$transaction([
      this.prismaService.user.update({
        where: {
          register,
        },
        data: {
          balance: {increment: this.parkingSessionService.hourPrice}
        }
      }),

      this.prismaService.user.updateMany({
        data: {
          points_gamefication: 0
        }
      })
    ])

    
    
    this.logger.log(`Usuário de nome: ${name} e registro: ${register}, foi o que obteve o melhor desempenho no mês anterior`);
    this.logger.log(`Pontos de gameificação foram zerados`);
  }
}
