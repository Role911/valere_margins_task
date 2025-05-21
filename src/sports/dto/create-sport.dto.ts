import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateSportDto {
  @ApiProperty({
    description: 'Type of sport (e.g., indoor or outdoor)',
    example: 'indoor',
  })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Name of the sport', example: 'Table Tennis' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Optional detailed description of the sport',
    example: 'A fast-paced indoor sport with paddles and a ball',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
