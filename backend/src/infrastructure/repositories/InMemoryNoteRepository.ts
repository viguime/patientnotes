import { Note } from '../../domain/entities/Note';
import { INoteRepository } from '../../domain/repositories/INoteRepository';

export class InMemoryNoteRepository implements INoteRepository {
  private notes: Map<string, Note[]> = new Map();

  async save(note: Note): Promise<void> {
    const patientNotes = this.notes.get(note.patientId) || [];
    patientNotes.push(note);
    this.notes.set(note.patientId, patientNotes);
  }

  async findByPatientId(patientId: string): Promise<Note[]> {
    return this.notes.get(patientId) || [];
  }

  // Helper method for testing
  clear(): void {
    this.notes.clear();
  }
}
