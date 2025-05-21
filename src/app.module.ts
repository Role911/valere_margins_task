import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/db-config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClassesModule } from './classes/classes.module';
import { ApplicationsModule } from './applications/application.module';
import { SportsModule } from './sports/sports.module';
import { SchedulesModule } from './schedules/schedules.module';
import { SeedModule } from './database/seeds/seed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    SportsModule,
    AuthModule,
    ClassesModule,
    ApplicationsModule,
    SchedulesModule,
    SeedModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
