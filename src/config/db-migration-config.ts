import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  schema: process.env.NODE_ENV === 'test' ? 'test' : 'public',
  logging: true,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432') || 5432,
  username: process.env.DB_USER || 'test',
  password: process.env.DB_PASS || 'test',
  database: process.env.DB_NAME || 'sport_app',
  entities: process.env.NODE_ENV
    ? ['dist/**/*.entity.js']
    : ['src/**/*.entity.ts'],
  migrations: process.env.NODE_ENV
    ? ['dist/database/migrations/*.js']
    : ['src/database/migrations/*.ts'],
});
