import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email address',
    example: 'admin@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
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
}
