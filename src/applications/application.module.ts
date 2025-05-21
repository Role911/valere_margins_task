import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Applications } from './entities/application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Applications])],
  providers: [],
})
export class ApplicationsModule {}
