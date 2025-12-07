import { Note } from '../entities/Note';

export interface INoteRepository {
  save(note: Note): Promise<void>;
  findByPatientId(patientId: string): Promise<Note[]>;
  findAll(): Promise<Note[]>;
  findAllPatients(): Promise<Array<{ id: string; name: string }>>;
}
