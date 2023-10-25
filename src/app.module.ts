import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './database/prisma.service';
import { StreetModule } from './admin/street/street.module';

@Module({
  imports: [StreetModule],
  controllers: [],
  providers: [AppService, PrismaService],
})
export class AppModule {}
