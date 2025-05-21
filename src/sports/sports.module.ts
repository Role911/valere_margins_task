import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sports } from './entities/sports.entity';
import { SportsService } from './services/sports.service';
import { SportsController } from './controllers/sports.controller';
import { Classes } from '../classes/entities/classes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sports, Classes])],
  providers: [SportsService],
  controllers: [SportsController],
})
export class SportsModule {}
