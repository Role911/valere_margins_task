import { Injectable } from '@nestjs/common';
import dataSource from './../../config/db-migration-config';
import { InjectRepository } from '@nestjs/typeorm';
import { Sports } from '../../sports/entities/sports.entity';
import { Classes } from '../../classes/entities/classes.entity';
import { Users } from '../../users/entities/users.entity';
import { Schedules } from '../../schedules/entites/schedules.entity';
import { Repository } from 'typeorm';
import { Applications } from '../../applications/entities/application.entity';
import { RoleType } from '../../users/enums/role.enum';
import * as bycrypt from 'bcryptjs';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Sports) private sportRepo: Repository<Sports>,
    @InjectRepository(Classes) private classRepo: Repository<Classes>,
    @InjectRepository(Users) private userRepo: Repository<Users>,
    @InjectRepository(Schedules) private scheduleRepo: Repository<Schedules>,
    @InjectRepository(Applications) private appRepo: Repository<Applications>,
  ) {}

  async run() {
    try {
      console.log('Running seeders...');
      await dataSource.initialize();

      await dataSource.query('SET session_replication_role = replica;');

      // Clear tables (order matters due to FKs)
      await dataSource.query('TRUNCATE TABLE applications CASCADE');
      await dataSource.query('TRUNCATE TABLE schedules CASCADE');
      await dataSource.query('TRUNCATE TABLE classes CASCADE');
      await dataSource.query('TRUNCATE TABLE users CASCADE');
      await dataSource.query('TRUNCATE TABLE sports CASCADE');

      // Create data
      const sport = await this.sportRepo.save({
        type: 'indor',
        name: 'Basketball',
      });

      const admin = await this.userRepo.save({
        email: 'admin@example.com',
        role: RoleType.ADMIN,
        name: 'Test',
        surname: 'Test',
        password: await bycrypt.hash('Password_$123', 10),
      });

      const user = await this.userRepo.save({
        email: 'user@example.com',
        role: RoleType.USER,
        name: 'Test',
        surname: 'Test',
        password: await bycrypt.hash('Password_$123', 10),
      });

      const sportClass = await this.classRepo.save({
        name: 'Basic Basketball',
        sport: sport,
        description: 'Indor basketball',
        duration: 120,
        participants: 20,
      });

      await this.scheduleRepo.save({
        date: new Date().toISOString(),
        class: sportClass,
        from: '10:00',
        to: '12:00',
      });

      await this.appRepo.save({
        user,
        class: sportClass,
        createdAt: new Date(),
      });

      // Re-enable FK constraints
      await dataSource.query('SET session_replication_role = DEFAULT;');
      console.log('Seeded successfully');
    } catch (error) {
      console.error('Error during seeding:', error);
    } finally {
      await dataSource.destroy();
    }
  }
}
