import { Module } from "@nestjs/common";
import { MulterModule } from '@nestjs/platform-express';
import { UploadsService } from "./uploads.service";

@Module({
  imports: [MulterModule.register({
    dest: './public/files',
  })],
  providers: [UploadsService]
})
export class UploadsModule { }