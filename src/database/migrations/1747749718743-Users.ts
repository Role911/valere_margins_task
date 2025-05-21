import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Users1747749718743 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar' },
          { name: 'surname', type: 'varchar' },
          {
            name: 'role',
            type: 'enum',
            enum: ['ADMIN', 'USER'],
            default: `'USER'`,
          },
          { name: 'password', type: 'varchar' },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
