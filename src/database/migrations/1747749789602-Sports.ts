import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Sports1747749789602 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'sports',
        columns: [
          { name: 'id', type: 'serial', isPrimary: true },
          { name: 'createdAt', type: 'timestamp', default: 'now()' },
          { name: 'updatedAt', type: 'timestamp', default: 'now()' },
          { name: 'type', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'description', type: 'text', isNullable: true },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('sports');
  }
}
