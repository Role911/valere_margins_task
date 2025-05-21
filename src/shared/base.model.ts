import {
  BaseEntity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'User Id', example: 1 })
  id: number;

  @CreateDateColumn()
  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: new Date() })
  updatedAt: Date;
}
