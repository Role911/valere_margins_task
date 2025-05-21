import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedules } from './entites/schedules.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedules])],
})
export class SchedulesModule {}
