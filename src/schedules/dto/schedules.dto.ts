import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateScheduleDto {
  @ApiProperty({
    description: 'Date of the schedule (YYYY-MM-DD)',
    example: '2026-10-10',
  })
  @IsDateString()
  date: string;

  @ApiProperty({ description: 'Start time of the class', example: '18:00' })
  @IsString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: 'End time of the class', example: '19:30' })
  @IsString()
  @IsNotEmpty()
  to: string;
}
