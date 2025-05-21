import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classes } from './entities/classes.entity';
import { ClassesService } from './services/classes.service';
import { ClassController } from './controllers/classes.controller';
import { Applications } from '../applications/entities/application.entity';
import { Schedules } from '../schedules/entites/schedules.entity';
import { Sports } from '../sports/entities/sports.entity';
import { Users } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Classes, Sports, Applications, Users, Schedules]),
  ],
  providers: [ClassesService],
  controllers: [ClassController],
})
export class ClassesModule {}
