import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../src/users/services/users.service';
import { Users } from '../src/users/entities/users.entity';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<Users>;

  const mockUserRepo = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const userEntity = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed_password',
    name: 'John',
    surname: 'Doe',
  } as Users;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useValue: mockUserRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<Users>>(getRepositoryToken(Users));

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        email: 'new@example.com',
        password: 'password123',
        name: 'New',
        surname: 'User',
      };

      mockUserRepo.findOne.mockResolvedValue(null); // no user with same email
      mockUserRepo.create.mockImplementation((data) => data);
      mockUserRepo.save.mockImplementation((user) =>
        Promise.resolve({ id: 2, ...user }),
      );

      const result = await service.create(dto);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({
        where: { email: dto.email },
      });
      expect(mockUserRepo.create).toHaveBeenCalled();
      expect(mockUserRepo.save).toHaveBeenCalled();
      expect(result).toMatchObject({ email: dto.email, name: 'New' });
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserRepo.findOne.mockResolvedValue(userEntity);

      await expect(
        service.create({
          email: userEntity.email,
          password: '123',
          name: 'A',
          surname: 'B',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserRepo.findOne.mockResolvedValue(userEntity);
      const result = await service.findOne(1);
      expect(result).toBe(userEntity);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return user by email', async () => {
      mockUserRepo.findOne.mockResolvedValue(userEntity);
      const result = await service.findByEmail(userEntity.email);
      expect(result).toBe(userEntity);
    });
  });

  describe('remove', () => {
    it('should throw BadRequestException if trying to delete own account', async () => {
      await expect(service.remove(1, 1)).rejects.toThrow(BadRequestException);
    });

    it('should remove user if valid', async () => {
      mockUserRepo.findOne.mockResolvedValue(userEntity);
      mockUserRepo.remove.mockResolvedValue(undefined);

      await service.remove(2, 1);

      expect(mockUserRepo.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
      expect(mockUserRepo.remove).toHaveBeenCalledWith(userEntity);
    });
  });
});
