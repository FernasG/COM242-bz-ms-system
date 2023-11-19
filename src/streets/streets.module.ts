import { Module } from "@nestjs/common";
import { StreetsController } from "./streets.controller";
import { StreetsService } from "./streets.service";
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from "src/uploads/uploads.service";

@Module({
  imports: [MulterModule.register({
    dest: './uploads', // Diretório onde os arquivos serão salvos
  })],
  controllers: [StreetsController],
  providers: [StreetsService, UploadsService]
})
export class StreetModule { }