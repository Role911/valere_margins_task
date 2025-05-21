import { Column, Entity, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../../shared/base.model';
import { Classes } from '../../classes/entities/classes.entity';

@Entity('sports')
export class Sports extends BaseModel {
  @ApiProperty({
    description: 'Type of sport (e.g., indoor or outdoor)',
    example: 'indoor',
  })
  @Column()
  type: string;

  @ApiProperty({ description: 'Name of the sport', example: 'Table Tennis' })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Optional detailed description of the sport',
    example: 'A fast-paced indoor sport with paddles and a ball',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @OneToMany(() => Classes, (sc) => sc.sport)
  classes: Classes[];
}
