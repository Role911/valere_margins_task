import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { BaseModel } from '../../shared/base.model';

import { ApiProperty } from '@nestjs/swagger';
import { Classes } from '../../classes/entities/classes.entity';

@Index(['date', 'from', 'to', 'classId'], { unique: true })  // composite unique index
@Entity('schedules')
export class Schedules extends BaseModel {
  @ApiProperty({
    description: 'Date of the schedule (YYYY-MM-DD)',
    example: '2026-10-10',
  })
  @Column({ type: 'date' })
  @Index()
  date: string;

  @ApiProperty({
    description: 'Start time of the class',
    example: '18:00',
  })
  @Column()
  @Index()
  from: string;

  @ApiProperty({
    description: 'End time of the class',
    example: '19:30',
  })
  @Column()
  @Index()
  to: string;

  @ApiProperty({
    description: 'Class associated with this schedule',
    type: () => Classes,
  })
  @ManyToOne(() => Classes, (cls) => cls.schedules, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classId' })
  class: Classes;

  @ApiProperty({
    description: 'ID of the class this schedule belongs to',
    example: 1,
  })
  @Column()
  @Index()
  classId: number;
}
