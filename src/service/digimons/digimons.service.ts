import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Digimon } from 'src/entity/digimon';
import { merge } from 'rxjs';

@Injectable()
export class DigimonsService {
  constructor(
    @InjectRepository(Digimon) private digimonRepository: Repository<Digimon>,
  ) {}

  findAll(): Promise<Digimon[]> {
    return this.digimonRepository.find();
  }

  findOne(id: string): Promise<Digimon> {
    return this.digimonRepository.findOne(id);
  }

  findOneWithNextGenerations(id: string): Promise<Digimon> {
    return this.digimonRepository.findOne({
      where: [
        {
          id: parseInt(id, 10),
        },
      ],
      relations: ['nextGeneration', 'beforeGeneration'],
    });
  }

  async findEvolutionalTree(
    id: string,
  ): Promise<{
    baseDigimon?: Digimon;
    digimons: Digimon[];
    evolutions: { from: number; to: number }[];
  }> {
    const baseDigimon = await this.digimonRepository.findOne({
      where: [
        {
          id: parseInt(id, 10),
        },
      ],
      relations: ['nextGeneration'],
    });

    const futureEvolutionalTree = await this.findFutureEvolutionalTree(id)

    const pastEvolutionalTree = await this.findPastEvolutionalTree(id)

    return {
      baseDigimon,
      digimons: futureEvolutionalTree.digimons.concat(pastEvolutionalTree.digimons),
      evolutions: futureEvolutionalTree.evolutions.concat(pastEvolutionalTree.evolutions)
    }
  }
  async findFutureEvolutionalTree(
    id: string,
  ): Promise<{
    baseDigimon?: Digimon;
    digimons: Digimon[];
    evolutions: { from: number; to: number }[];
  }> {
    const baseDigimon = await this.digimonRepository.findOne({
      where: [
        {
          id: parseInt(id, 10),
        },
      ],
      relations: ['nextGeneration'],
    });

    const futureEvolutionalTrees =
      baseDigimon.nextGeneration.length > 0
        ? await Promise.all(
            baseDigimon.nextGeneration.map(digimon =>
              this.findFutureEvolutionalTree(digimon.id.toString()),
            ),
          )
        : [{ digimons: [], evolutions: [] }];

    const mergedTree = futureEvolutionalTrees.reduce(
      (merged, tree) => {
        if (!tree.baseDigimon) return merged
        merged.digimons.push(tree.baseDigimon)
        merged.evolutions.push({
          from: baseDigimon.id,
          to: tree.baseDigimon.id
        })
        
        for (const digimon of tree.digimons) {
          if (!merged.digimons.some(digimon2 => digimon2.id === digimon.id)) {
            merged.digimons = merged.digimons.concat(digimon);
          }
        }
        for (const evolution of tree.evolutions) {
          merged.evolutions = merged.evolutions.concat(evolution);
        }
        return merged;
      },
      { digimons: [], evolutions: [] },
    );
    return {
      baseDigimon,
      ...mergedTree
    }
  }
  async findPastEvolutionalTree(
    id: string,
  ): Promise<{
    baseDigimon?: Digimon;
    digimons: Digimon[];
    evolutions: { from: number; to: number }[];
  }> {
    const baseDigimon = await this.digimonRepository.findOne({
      where: [
        {
          id: parseInt(id, 10),
        },
      ],
      relations: ['beforeGeneration'],
    });

    const beforeEvolutionalTrees =
      baseDigimon.beforeGeneration.length > 0
        ? await Promise.all(
            baseDigimon.beforeGeneration.map(digimon =>
              this.findPastEvolutionalTree(digimon.id.toString()),
            ),
          )
        : [{ digimons: [], evolutions: [] }];

    const mergedTree = beforeEvolutionalTrees.reduce(
      (merged, tree) => {
        if (!tree.baseDigimon) return merged
        merged.digimons.push(tree.baseDigimon)
        merged.evolutions.push({
          from: baseDigimon.id,
          to: tree.baseDigimon.id
        })
        
        for (const digimon of tree.digimons) {
          if (!merged.digimons.some(digimon2 => digimon2.id === digimon.id)) {
            merged.digimons = merged.digimons.concat(digimon);
          }
        }
        for (const evolution of tree.evolutions) {
          merged.evolutions = merged.evolutions.concat(evolution);
        }
        return merged;
      },
      { digimons: [], evolutions: [] },
    );
    return {
      baseDigimon,
      ...mergedTree
    }
  }
}
