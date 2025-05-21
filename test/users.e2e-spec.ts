import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AuthService } from '../src/auth/services/auth.service';
import { HttpExceptionFilter } from '../src/shared/interceptors/http.exception';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { RoleType } from '../src/users/enums/role.enum';
import { Users } from '../src/users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';

describe('Users API (e2e)', () => {
  let app: NestExpressApplication;
  let jwtToken: string;
  let createdUserId: number;
  let authService: AuthService;
  let dataSource: DataSource;

  const getDataSource = () =>
    new DataSource({
      type: 'postgres',
      schema: process.env.NODE_ENV === 'test' ? 'test' : 'public',
      synchronize: !!process.env.DB_SYNC,
      logging: true,
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432') || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'celeroOne',
      entities: ['src/**/*.entity.ts'],
    });
  beforeAll(async () => {
    dataSource = getDataSource();
    await dataSource.initialize();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);

    const adminUser: CreateUserDto = {
      email: 'admin@test.com',
      password: 'Admin123!',
      name: 'Admin',
      surname: 'User',
      role: RoleType.ADMIN,
    };

    await authService.register(adminUser);
    const { token } = await authService.loginUser({
      email: adminUser.email,
      password: adminUser.password,
    });
    jwtToken = token;
  });

  afterAll(async () => {
    await app.close();
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();
    }
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'user@test.com',
        password: 'User123!',
        name: 'John',
        surname: 'Doe',
        role: RoleType.USER,
      };

      const response = await request(app.getHttpServer())
        .post('/api/users/')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(createUserDto)
        .expect(201);
      const user = response.body as Users;
      expect(user.email).toBe(createUserDto.email);
      expect(user.name).toBe(createUserDto.name);
      expect(user.surname).toBe(createUserDto.surname);
      expect(user.id).toBeDefined();
      createdUserId = user.id;
    });

    it('should fail to create a duplicate user', async () => {
      const duplicateUserDto: CreateUserDto = {
        email: 'user@test.com',
        password: 'User123!',
        name: 'John',
        surname: 'Doe',
        role: RoleType.USER,
      };

      await request(app.getHttpServer())
        .post('/api/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(duplicateUserDto)
        .expect(409);
    });
  });

  describe('GET /api/users', () => {
    it('should return a list of users', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      const users = response.body as Users[];
      expect(Array.isArray(users)).toBe(true);
      expect(users.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      expect((response.body as Users).id).toBe(createdUserId);
    });

    it('should return 404 for non-existent user', async () => {
      await request(app.getHttpServer())
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update a user', async () => {
      const updatedDto = {
        name: 'Updated',
        surname: 'User',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .send(updatedDto)
        .expect(200);

      const updatedUser: Users = response.body;
      expect(updatedUser.name).toBe(updatedDto.name);
    });

    it('should return 404 for updating non-existent user', async () => {
      await request(app.getHttpServer())
        .patch('/api/users/99999')
        .set('Authorization', `Bearer ${jwtToken}`)
        .send({ name: 'Nope' })
        .expect(404);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should not allow self-deletion', async () => {
      const jwtService = new JwtService({
        secret: process.env.JWT_SECRET || 'JWT_SECRET_123456',
      });
      const user: any = jwtService.decode(jwtToken);
      await request(app.getHttpServer())
        .delete(`/api/users/${user?.id}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(400);
    });

    it('should delete the created user', async () => {
      await request(app.getHttpServer())
        .delete(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/api/users/${createdUserId}`)
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(404);
    });
  });
});
