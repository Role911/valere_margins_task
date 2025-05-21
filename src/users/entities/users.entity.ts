import { Column, Entity, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../../shared/base.model';
import { RoleType } from '../enums/role.enum';
import { Applications } from '../../applications/entities/application.entity';

@Entity('users')
export class Users extends BaseModel {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'name', example: 'Test' })
  @Column()
  name: string;

  @ApiProperty({ description: 'surname', example: 'Test' })
  @Column()
  surname: string;

  @ApiProperty({
    description: 'Role type',
    enum: RoleType,
    enumName: 'RoleType',
    example: RoleType.USER,
  })
  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.USER,
  })
  role: RoleType;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Applications, (app) => app.user)
  applications: Applications[];
}