import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sports } from '../entities/sports.entity';
import { CreateSportDto } from '../dto/create-sport.dto';
import { Classes } from '../../classes/entities/classes.entity';

@Injectable()
export class SportsService {
  constructor(
    @InjectRepository(Sports)
    private readonly sportsRepository: Repository<Sports>,

    @InjectRepository(Classes)
    private readonly classesRepositroy: Repository<Classes>,
  ) {}

  async create(data: CreateSportDto): Promise<Sports> {
    const existingSport = await this.sportsRepository.findOne({
      where: { name: data.name, type: data.type },
    });

    if (existingSport) {
      throw new ConflictException(
        `Sport with name "${data.name}" and type already exists.`,
      );
    }

    const sport = this.sportsRepository.create(data);
    return this.sportsRepository.save(sport);
  }

  async findAll(): Promise<Sports[]> {
    return this.sportsRepository.find({
      relations: ['classes'],
    });
  }

  async findOne(id: number): Promise<Sports> {
    const sport = await this.sportsRepository.findOne({
      where: { id },
      relations: ['classes'],
    });

    if (!sport) {
      throw new NotFoundException(`Sport with ID ${id} not found`);
    }

    return sport;
  }

  async update(id: number, data: CreateSportDto): Promise<Sports> {
    const sport = await this.findOne(id);

    if (data.name && data.name !== sport.name) {
      const existingSport = await this.sportsRepository.findOne({
        where: { name: data.name, type: data.name },
      });

      if (existingSport) {
        throw new ConflictException(
       `Sport with name "${data.name}" and type already exists.`,
        );
      }
    }

    Object.assign(sport, data);
    return this.sportsRepository.save(sport);
  }

  async remove(id: number): Promise<void> {
    const sport = await this.findOne(id);

    const relatedClasses = await this.classesRepositroy.find({
      where: { sport: { id } },
    });

    if (relatedClasses.length > 0) {
      throw new ConflictException(
        'Cannot delete sport because it has associated classes. Please delete the classes first.',
      );
    }

    await this.sportsRepository.remove(sport);
  }
}
