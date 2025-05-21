import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class CreateSchedulesTable1747752345678 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'schedules',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'date',
            type: 'date',
            isNullable: false,
          },
          {
            name: 'from',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'to',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'classId',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'schedules',
      new TableForeignKey({
        columnNames: ['classId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'classes',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createIndex(
      'schedules',
      new TableIndex({
        name: 'IDX_SCHEDULES_DATE_FROM_TO_CLASSID',
        columnNames: ['date', 'from', 'to', 'classId'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasTable = await queryRunner.hasTable('schedules');
    if (hasTable) {
      const table = await queryRunner.getTable('schedules');

      // Example: drop a foreign key if it exists
      const foreignKey = table?.foreignKeys.find((fk) =>
        fk.columnNames.includes('classId'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('schedules', foreignKey);
      }

      // Example: drop an index if it exists
      const index = table?.indices.find(
        (i) => i.name === 'IDX_SCHEDULES_DATE_FROM_TO_CLASSID',
      );
      if (index) {
        await queryRunner.dropIndex('schedules', index);
      }

      await queryRunner.dropTable('schedules');
    }
  }
}
