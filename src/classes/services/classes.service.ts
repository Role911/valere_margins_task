import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classes } from '../entities/classes.entity';
import { Sports } from '../../sports/entities/sports.entity';
import { Schedules } from '../../schedules/entites/schedules.entity';
import { CreateClassDto } from '../dto/classes.dto';
import { Applications } from '../../applications/entities/application.entity';
import { QueryDto } from '../../shared/dtos/query.dto';
import { Users } from '../../users/entities/users.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Classes)
    private readonly classesRepository: Repository<Classes>,

    @InjectRepository(Sports)
    private readonly sportsRepository: Repository<Sports>,

    @InjectRepository(Schedules)
    private readonly schedulesRepository: Repository<Schedules>,

    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,

    @InjectRepository(Applications)
    private readonly applicationsRepository: Repository<Applications>,
  ) {}

  async create(createDto: CreateClassDto): Promise<Classes> {
    const sport = await this.sportsRepository.findOne({
      where: { id: createDto.sportId },
    });

    if (!sport) {
      throw new NotFoundException('Sport not found');
    }

    const newClass = this.classesRepository.create({
      ...createDto,
      sport,
    });

    const savedClass = await this.classesRepository.save(newClass);

    if (createDto.schedules?.length) {
      const schedules = createDto.schedules.map((item) =>
        this.schedulesRepository.create({
          date: item.date,
          from: item.from,
          to: item.to,
          classId: savedClass.id,
        }),
      );

      await this.schedulesRepository.save(schedules);
      savedClass.schedules = schedules;
    }

    return savedClass;
  }

  async findAll(query: QueryDto): Promise<{ data: Classes[]; total: number }> {
    const qb = this.classesRepository
      .createQueryBuilder('class')
      .leftJoinAndSelect('class.schedules', 'schedules')
      .leftJoinAndSelect('class.applications', 'applications')
      .leftJoinAndSelect('class.sport', 'sport');

    if (query.sports?.length) {
      const sportNames = query.sports.split(',');
      qb.andWhere('sport.name IN (:...sportNames)', { sportNames });
    }

    qb.limit(query.take || 30);
    qb.offset(query.skip || 0);

    const [data, total] = await qb.getManyAndCount();

    return { data, total };
  }

  async findOne(id: number): Promise<Classes> {
    const cls = await this.classesRepository.findOne({
      where: { id },
      relations: ['schedules', 'applications', 'sport'],
    });

    if (!cls) {
      throw new NotFoundException('Class not found');
    }

    return cls;
  }

  async update(id: number, updateDto: CreateClassDto): Promise<Classes> {
    const cls = await this.findOne(id);

    if (updateDto.sportId && updateDto.sportId !== cls.sport.id) {
      const sport = await this.sportsRepository.findOne({
        where: { id: updateDto.sportId },
      });
      if (!sport) throw new NotFoundException('Sport not found');
      cls.sport = sport;
    }

    if (updateDto.schedules?.length) {
      await this.schedulesRepository.delete({ classId: cls.id });
      const schedules = updateDto.schedules.map((item) =>
        this.schedulesRepository.create({
          date: item.date,
          from: item.from,
          to: item.to,
          classId: cls.id,
        }),
      );
      await this.schedulesRepository.save(schedules);
      updateDto.schedules = schedules;
    }
    Object.assign(cls, updateDto);
    return this.classesRepository.save(cls);
  }

  async remove(id: number): Promise<void> {
    const cls = await this.findOne(id);
    await this.classesRepository.remove(cls);
  }

  async register(classId: number, userId: number): Promise<Applications> {
    console.log(userId)
    const cls = await this.classesRepository.findOne({
      where: { id: classId },
      relations: ['applications'],
    });

    if (!cls) {
      throw new NotFoundException('Class not found');
    }

    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const alreadyApplied = await this.applicationsRepository.findOne({
      where: { classId, userId },
    });

    if (alreadyApplied) {
      throw new ConflictException('You have already registered for this class');
    }

    const totalApplicants = await this.applicationsRepository.count({
      where: { classId },
    });

    if (totalApplicants >= cls.participants) {
      throw new ConflictException('Class is already full');
    }

    const application = this.applicationsRepository.create({
      user,
      userId,
      class: cls,
      classId,
    });

    return this.applicationsRepository.save(application);
  }

  async getClassApplications(classId: number): Promise<Applications[]> {
    const classExists = await this.classesRepository.findOneBy({ id: classId });

    if (!classExists) {
      throw new NotFoundException(`Class with ID ${classId} not found.`);
    }

    return this.applicationsRepository.find({
      where: { classId },
      relations: ['user'],
    });
  }

  async unregister(classId: number, userId: number): Promise<void> {
    const application = await this.applicationsRepository.findOneBy({
      classId,
      userId,
    });

    if (!application) {
      throw new NotFoundException(
        'Application not found for the given user and class.',
      );
    }

    await this.applicationsRepository.remove(application);
  }

  async removeClass(id: number): Promise<void> {
    const sportsClass = await this.findOne(id);

    const registrationsCount = await this.applicationsRepository.count({
      where: { classId: id },
    });

    if (registrationsCount > 0) {
      throw new ConflictException(
        'Cannot delete the class because it has registered participants. The registrations must be deleted first.',
      );
    }

    // Delete the class
    await this.classesRepository.remove(sportsClass);
  }
}
