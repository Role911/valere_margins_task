import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address',
    example: 'test@test.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description:
      'min length 8 characters, must contain al least 1 number and special character and lowercase letter and uppercase letter',
  })
  @MinLength(8)
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W+)[A-Za-z\d\W+\-_.:;,<>#]{8,}/,
    {
      message:
        'password must contain al least 1 number and special character and lowercase letter and uppercase letter',
    },
  )
  password: string;

  @ApiProperty({
    description: 'First name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'Name must contain only letters' })
  name: string;

  @ApiProperty({
    description: 'Surname name',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-Z]+$/, { message: 'Surname must contain only letters' })
  surname: string;

  @ApiProperty({
    description: 'Role type',
    enum: RoleType,
    enumName: 'RoleType',
    example: RoleType.USER,
    required: false,
  })
  @IsEnum(RoleType)
  @IsOptional()
  role?: RoleType;
}