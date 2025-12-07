import { Pool } from 'pg';
import dotenv from 'dotenv';
import { INoteRepository } from '../../domain/repositories/INoteRepository';
import { InMemoryNoteRepository } from '../repositories/InMemoryNoteRepository';
import { PostgresNoteRepository } from '../repositories/PostgresNoteRepository';

dotenv.config();

export const createNoteRepository = (): INoteRepository => {
  const dbType = process.env.DB_TYPE || 'in-memory';

  if (dbType === 'postgres') {
    const pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'patient_notes',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    console.log('Using PostgreSQL repository');
    return new PostgresNoteRepository(pool);
  }

  console.log('Using In-Memory repository');
  return new InMemoryNoteRepository();
};
