<p align="center">
  <a href="https://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" />
  </a>
</p>

## Description

Sport Complex backend project, built using the [NestJS](https://github.com/nestjs/nest) framework with TypeScript.


-  JWT-based authentication with role-based authorization
-  Full CRUD for users, classes, sports, and applications
-  Schedule integration for classes
-  Swagger documentation at `/api`
-  Unit and e2e testing with Jest and Supertest

## Setup (Local System)

You should have the latest version of NodeJS and PostgreSQL installed on your system.

- [Download NodeJS](https://nodejs.org/en/download/)
- [Download PostgreSQL](https://www.postgresql.org/download/)

After installing PostgreSQL, create an empty database.  
Make sure the database collation is set to **UTF-8**.

Install Nest CLI:


```bash
$ npm install -g @nestjs/cli
```

Clone the project

```bash
$ git clone https://github.com/Role911/valere_margins_task
```

```bash
$ nvm use node 20
```

Install dependencies

```bash
$ npm install
```

Create a file called `.env` in the root of the project and add your database credentials.

Example:

```
#database
DB_USER=postgres
DB_PASS=postgres
DB_NAME=sport_app   
DB_PORT=5432
DB_HOST=localhost

# JWT Configuration
JWT_SECRET=your-secret

# Application Configuration
PORT=3000
NODE_ENV=production
```

Before running the application for the first time, run the script to create entites

```bash
$ npm run db:migrate
```

# Development
npm run start

# Production
npm run start:prod

## Test

```bash
# unit tests
$ npm run test
```

### e2e tests

```bash
$ npm run test:e2e
```

## Migrations 

Running migration

```bash
$ npm run migration:run
```
Revert migration

```bash
$ npm run migration:revert
```

## Seed data 
```bash
$ npm run data:seed
```

## Useful links

- Nestjs documentation - [https://docs.nestjs.com/](https://docs.nestjs.com/)
- TypeORM documentation - [https://typeorm.io](https://typeorm.io)



