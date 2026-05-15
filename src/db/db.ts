import { Database } from 'bun:sqlite';

let dbInstance: Database | null = null;

export function initDB() {
  if (dbInstance) throw new Error('Database already initialized!');

  dbInstance = new Database('./db_data/cfdb.sqlite', {
    create: true,
    strict: true
  });

  dbInstance.run('PRAGMA journal_mode = WAL;');

  dbInstance.run('CREATE TABLE IF NOT EXISTS bookmarks (id TEXT PRIMARY KEY, data TEXT)');

  return dbInstance;
}

export function getDB() {
  if (!dbInstance) {
    throw new Error('Database not initialized! Call initDB first!');
  }

  return dbInstance;
}
