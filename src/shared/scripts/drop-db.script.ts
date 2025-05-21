// drop-database.ts
import dataSource from './../../config/db-migration-config';

async function dropAll() {
  try {
    await dataSource.initialize();
    await dataSource.dropDatabase(); // Drops all tables
    await dataSource.destroy();
    console.log('Database schema dropped successfully.');
  } catch (err) {
    console.error('Failed to drop schema:', err);
  }
}

dropAll();
