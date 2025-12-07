import { Pool } from 'pg';
import { Note, NoteEntity } from '../../domain/entities/Note';
import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class PostgresNoteRepository implements INoteRepository {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async save(note: Note): Promise<void> {
    const query = `
      INSERT INTO notes (id, patient_id, patient_name, type, content, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;
    await this.pool.query(query, [
      note.id,
      note.patientId,
      note.patientName,
      note.type,
      note.content,
      note.createdAt,
    ]);
  }

  async findByPatientId(patientId: string): Promise<Note[]> {
    const query = `
      SELECT id, patient_id, patient_name, type, content, created_at
      FROM notes
      WHERE patient_id = $1
      ORDER BY created_at DESC
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
}
