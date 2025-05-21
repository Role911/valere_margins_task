import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateClassesTable1747751234567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'classes',
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
            name: 'description',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'duration',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'participants',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'sportId',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'classes',
      new TableForeignKey({
        columnNames: ['sportId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'sports',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const hasClassesTable = await queryRunner.hasTable('classes');

    if (hasClassesTable) {
      const table = await queryRunner.getTable('classes');

      const foreignKey = table?.foreignKeys.find((fk) =>
        fk.columnNames.includes('sportId'),
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey('classes', foreignKey);
      }

      await queryRunner.dropTable('classes');
    }
  }
}
