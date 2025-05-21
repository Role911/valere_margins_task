import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../../shared/base.model';
import { Sports } from '../../sports/entities/sports.entity';
import { Applications } from '../../applications/entities/application.entity';
import { Schedules } from '../../schedules/entites/schedules.entity';

@Entity('classes')
export class Classes extends BaseModel {
  @ApiProperty({
    description: 'Detailed description of the class',
    example: 'High-intensity interval training for beginners',
  })
  @Column()
  description: string;

  @ApiProperty({
    description: 'Duration of the class in minutes',
    example: 60,
  })
  @Column()
  duration: number;

  @ApiProperty({
    description: 'Number of participans',
    example: 60,
  })
  @Column()
  participants: number;

  @ApiProperty({
    description: 'The sport this class belongs to',
    type: () => Sports
  })
  @ManyToOne(() => Sports, (sport) => sport.classes, { eager: true })
  @JoinColumn({ name: 'sportId' })
  sport: Sports;

  @ApiProperty({
    description: 'Applications submitted for this class',
    type: () => [Applications],
  })
  @OneToMany(() => Applications, (app) => app.class, { eager: true })
  applications: Applications[];

  @ApiProperty({
    description: 'Weekly schedule entries for this class',
    type: () => [Schedules],
  })
  @OneToMany(() => Schedules, (schedule) => schedule.class, { eager: true })
  schedules: Schedules[];
}
