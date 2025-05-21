import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sports } from '../../sports/entities/sports.entity';
import { Classes } from '../../classes/entities/classes.entity';
import { Users } from '../../users/entities/users.entity';
import { Schedules } from '../../schedules/entites/schedules.entity';
import { Applications } from '../../applications/entities/application.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sports, Classes, Users, Schedules, Applications]),
  ],
  providers: [SeedService],
})
export class SeedModule {}
