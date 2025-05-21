import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateScheduleDto } from '../../schedules/dto/schedules.dto';
import { Type } from 'class-transformer';

export class CreateClassDto {
  @ApiProperty({
    description: 'Detailed description of the class',
    example: 'High-intensity interval training for beginners',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Duration of the class in minutes',
    example: 60,
  })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Number of participants allowed',
    example: 20,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  participants: number;

  @ApiProperty({
    description: 'ID of the sport this class belongs to',
    example: 3,
  })
  @IsInt()
  sportId: number;

  @ApiProperty({
    description: 'Optional schedule entries for this class',
    type: [CreateScheduleDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateScheduleDto)
  schedules?: CreateScheduleDto[];
}
