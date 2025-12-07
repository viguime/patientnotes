import { Pool } from 'pg';
import { Note, NoteEntity } from '../../domain/entities/Note';
import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class PostgresNoteRepository implements INoteRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async save(note: Note): Promise<void> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert or update patient
      const upsertPatientQuery = `
        INSERT INTO patients (id, name, created_at)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
      `;
      await client.query(upsertPatientQuery, [
        note.patientId,
        note.patientName,
        note.createdAt,
      ]);
      
      // Insert note
      const insertNoteQuery = `
        INSERT INTO notes (id, patient_id, type, content, created_at)
        VALUES ($1, $2, $3, $4, $5)
      `;
      await client.query(insertNoteQuery, [
        note.id,
        note.patientId,
        note.type,
        note.content,
        note.createdAt,
      ]);
      
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async findByPatientId(patientId: string): Promise<Note[]> {
    const query = `
      SELECT n.id, n.patient_id, p.name as patient_name, n.type, n.content, n.created_at
      FROM notes n
      JOIN patients p ON n.patient_id = p.id
      WHERE n.patient_id = $1
      ORDER BY n.created_at DESC
    `;
    const result = await this.pool.query(query, [patientId]);

    return result.rows.map(
      (row) =>
        new NoteEntity(
          row.id,
          row.patient_id,
          row.patient_name,
          row.type,
          row.content,
          new Date(row.created_at)
        )
    );
  }

  async findAll(): Promise<Note[]> {
    const query = `
      SELECT n.id, n.patient_id, p.name as patient_name, n.type, n.content, n.created_at
      FROM notes n
      JOIN patients p ON n.patient_id = p.id
      ORDER BY n.created_at DESC
    `;
    const result = await this.pool.query(query);

    return result.rows.map(
      (row) =>
        new NoteEntity(
          row.id,
          row.patient_id,
          row.patient_name,
          row.type,
          row.content,
          new Date(row.created_at)
        )
    );
  }

  async findAllPatients(): Promise<Array<{ id: string; name: string }>> {
    const query = `
      SELECT id, name
      FROM patients
      ORDER BY name ASC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }
}
