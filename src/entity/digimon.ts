import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Digimon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  generation: string;

  @Column()
  hp: string;

  @Column()
  mp: string;

  @Column()
  strength: string;

  @Column()
  stamina: string;

  @Column()
  wisdom: string;

  @Column()
  speed: string;

  @Column()
  weight: string;

  @Column()
  mistakes: string;

  @Column()
  bond: string;

  @Column()
  discipline: string;

  @Column()
  wins: string;

  @Column()
  keyDigimon: string;

  @Column()
  keyPoints: string;

  @ManyToMany(type => Digimon, user => user.beforeGeneration)
  @JoinTable()
  nextGeneration: Digimon[];

  @ManyToMany(type => Digimon, user => user.nextGeneration)
  beforeGeneration: Digimon[];

}
