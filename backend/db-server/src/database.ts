import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database | null = null;

export const getDb = async () => {
    if (db) {
        return db;
    }
    try {
        db = await open({
            filename: './db/dev-dashboard.db',
            driver: sqlite3.Database
        });
    } catch (e) {
        db = new Database({
            filename: './db/dev-dashboard.db',
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
        });

    }
    return db;
};

export const initDb = async () => {
    const db = await getDb();
    await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      status INTEGER DEFAULT 1,
      priority STRING DEFAULT 'low', 
      due_date TIMESTAMP,
      assignee STRING,
      tags STRING
    )
  `);
    console.log('Database initialized');
};
