import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcryptjs';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Users } from '../entities/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {}

  async create(data: CreateUserDto): Promise<Users> {
    let user;
    user = await this.findByEmail(data.email);
    if (user) {
      throw new ConflictException(`User already exists!`);
    }
    const hashedPassword = await bycrypt.hash(data.password, 10);
    user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }

  async findOne(id: number): Promise<Users> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<Users | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async find(): Promise<Users[]> {
    return this.userRepository.find();
  }
  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }
  async remove(id: number, userId: number): Promise<void> {
    if (id === userId) {
      throw new BadRequestException(
        'You cannot delete your own account. Please contact admin support',
      );
    }

    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
