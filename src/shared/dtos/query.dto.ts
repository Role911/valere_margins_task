import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryDto {
  @ApiPropertyOptional({ description: 'Number of rows to return (default: 30)' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  take?: number;

  @ApiProperty({ description: 'Number of rows to skip (default: 0)' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(0)
  skip?: number;

  @ApiPropertyOptional({
    description: 'Comma-separated sport names to filter classes',
    example: 'soccer,basketball',
  })
  @IsOptional()
  @IsString()
  sports?: string;
}
