import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { RoleType } from '../enums/role.enum';

export class UpdateUserDto {
  @ApiProperty({
    description: 'First name',
    example: 'Test',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'Name must contain only letters' })
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Last name',
    example: 'Test',
    required: false,
  })
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'Surname must contain only letters' })
  @IsOptional()
  surname?: string;

  @ApiProperty({
    description: 'Role type',
    enum: RoleType,
    enumName: 'RoleType',
    example: RoleType.ADMIN,
    required: false,
  })
  @IsEnum(RoleType)
  @IsOptional()
  role?: RoleType;
}
