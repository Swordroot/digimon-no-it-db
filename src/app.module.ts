import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from "@nestjs/typeorm";
import { Digimon } from './entity/digimon';
import { DigimonsModule } from './module/digimons/digimons.module';
import { DigimonsService } from './service/digimons/digimons.service';
import { DigimonsController } from './controllers/digimons/digimons.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33061,
      username: 'root',
      password: '',
      database: 'digimon',
      entities: [Digimon],
      synchronize: true
    }),
    DigimonsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
