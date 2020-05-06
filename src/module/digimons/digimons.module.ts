import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DigimonsController } from "src/controllers/digimons/digimons.controller";
import { DigimonsService } from "src/service/digimons/digimons.service";
import { Digimon } from "src/entity/digimon";

@Module({
  imports: [TypeOrmModule.forFeature([Digimon])],
  providers: [DigimonsService],
  controllers: [DigimonsController]
})
export class DigimonsModule {}
