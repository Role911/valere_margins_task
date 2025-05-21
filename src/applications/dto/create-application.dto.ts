import { ApiProperty } from '@nestjs/swagger';
import { BaseModel } from '../../shared/base.model';

export class CreateApplicationDto extends BaseModel {
  @ApiProperty({
    description: 'ID of the user applying',
    example: 12,
  })
  userId: number;

  @ApiProperty({
    description: 'ID of the class being applied for',
    example: 5,
  })
  classId: number;
}
