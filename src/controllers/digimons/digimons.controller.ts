import { Controller, Get, Param } from '@nestjs/common';
import { DigimonsService } from "src/service/digimons/digimons.service";
import { Digimon } from 'src/entity/digimon';

@Controller('digimons')
export class DigimonsController {
  constructor(private readonly digimonsService: DigimonsService){}

  @Get()
  async getAll(): Promise<Digimon[]> {
    return this.digimonsService.findAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: string): Promise<Digimon> {
    return this.digimonsService.findOneWithNextGenerations(id)
  }

  @Get('/:id/tree')
  async getTree(@Param('id') id: string): Promise<{
    baseDigimon?: Digimon;
    digimons: Digimon[];
    evolutions: { from: number; to: number }[];
  }> {
    return this.digimonsService.findEvolutionalTree(id)
  }
}
