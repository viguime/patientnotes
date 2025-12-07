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

  async findAll(): Promise<Note[]> {
    const allNotes: Note[] = [];
    this.notes.forEach((notes) => {
      allNotes.push(...notes);
    });
    return allNotes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findAllPatients(): Promise<Array<{ id: string; name: string }>> {
    const patientsMap = new Map<string, string>();
    this.notes.forEach((notes, patientId) => {
      if (notes.length > 0) {
        patientsMap.set(patientId, notes[0].patientName);
      }
    });
    return Array.from(patientsMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Helper method for testing
  clear(): void {
    this.notes.clear();
  }
}
