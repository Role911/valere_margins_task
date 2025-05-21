import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseModel } from '../../shared/base.model';
import { ApiProperty } from '@nestjs/swagger';
import { Classes } from '../../classes/entities/classes.entity';
import { Users } from '../../users/entities/users.entity';

@Entity('applications')
export class Applications extends BaseModel {
  @ApiProperty({
    description: 'The user who submitted the application',
    type: () => Users,
  })
  @ManyToOne(() => Users, (user) => user.applications, {
    eager: true,
    nullable: false,
  })
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ApiProperty({
    description: 'ID of the user who submitted the application',
    example: 12,
  })
  @Column()
  userId: number;

  @ApiProperty({
    description: 'The class this application is for',
    type: () => Classes,
  })
  @ManyToOne(() => Classes, (cls) => cls.applications)
  @JoinColumn({ name: 'classId' })
  class: Classes;

  @ApiProperty({
    description: 'ID of the class applied for',
    example: 5,
  })
  @Column()
  classId: number;
}
