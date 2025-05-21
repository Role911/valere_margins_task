import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../src/users/controllers/users.controller';
import { RoleType } from '../src/users/enums/role.enum';
import { UsersService } from '../src/users/services/users.service';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { UpdateUserDto } from '../src/users/dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = {
    id: 1,
    email: 'admin@example.com',
    name: 'Admin',
    surname: 'User',
    password: 'hashed-password',
    role: RoleType.ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsers = [
    mockUser,
    {
      ...mockUser,
      id: 2,
      email: 'user@example.com',
      role: RoleType.USER,
    },
  ];

  const mockUsersService = {
    create: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn().mockResolvedValue(mockUsers),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ ...mockUser, firstName: 'Updated' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const dto: CreateUserDto = {
        email: 'admin@example.com',
        name: 'Admin',
        surname: 'User',
        password: 'secret',
        role: RoleType.USER
      };
      const result = await controller.create(dto);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUsersService.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const dto: UpdateUserDto = {
        name: 'Updated',
        surname: 'User',
        role: RoleType.USER,
      };
      const result = await controller.update(1, dto);
      expect(result).toEqual({ ...mockUser, firstName: 'Updated' });
      expect(mockUsersService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockRequest = { user: { id: 2 } }; // Simulate deleting someone else
      await controller.remove(1, mockRequest as any);
      expect(mockUsersService.remove).toHaveBeenCalledWith(1, 2);
    });
  });
});
