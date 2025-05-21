import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
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
    description: 'User name',
    example: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User surname',
    example: 'Test',
  })
  @IsString()
  @IsNotEmpty()
  surname: string;
}
