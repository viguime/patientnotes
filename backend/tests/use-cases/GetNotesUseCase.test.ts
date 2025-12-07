import { GetNotesUseCase } from '../../src/domain/use-cases/GetNotesUseCase';
import { CreateNoteUseCase } from '../../src/domain/use-cases/CreateNoteUseCase';
import { InMemoryNoteRepository } from '../../src/infrastructure/repositories/InMemoryNoteRepository';

describe('GetNotesUseCase', () => {
  let getNotesUseCase: GetNotesUseCase;
  let createNoteUseCase: CreateNoteUseCase;
  let noteRepository: InMemoryNoteRepository;

  beforeEach(() => {
    noteRepository = new InMemoryNoteRepository();
    getNotesUseCase = new GetNotesUseCase(noteRepository);
    createNoteUseCase = new CreateNoteUseCase(noteRepository);
  });

  it('should return empty array when no notes exist', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';

    const notes = await getNotesUseCase.execute(patientId);

    expect(notes).toEqual([]);
  });

  it('should return notes for a specific patient', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';
    const anotherPatientId = '223e4567-e89b-12d3-a456-426614174000';

    await createNoteUseCase.execute(patientId, 'Patient One', 'initial', 'First note for patient 1');
    await createNoteUseCase.execute(anotherPatientId, 'Patient Two', 'initial', 'First note for patient 2');
    await createNoteUseCase.execute(patientId, 'Patient One', 'interim', 'Second note for patient 1');

    const notes = await getNotesUseCase.execute(patientId);

    expect(notes).toHaveLength(2);
    expect(notes.every((note) => note.patientId === patientId)).toBe(true);
  });

  it('should return notes sorted by creation date (newest first)', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';

    const note1 = await createNoteUseCase.execute(patientId, 'John Doe', 'initial', 'First note content here');
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    const note2 = await createNoteUseCase.execute(patientId, 'John Doe', 'interim', 'Second note content here');
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    const note3 = await createNoteUseCase.execute(patientId, 'John Doe', 'discharge', 'Third note content here');

    const notes = await getNotesUseCase.execute(patientId);

    expect(notes).toHaveLength(3);
    expect(notes[0].id).toBe(note3.id); // Newest first
    expect(notes[1].id).toBe(note2.id);
    expect(notes[2].id).toBe(note1.id); // Oldest last
  });

  it('should throw error for invalid patient ID', async () => {
    const invalidPatientId = 'invalid-id';

    await expect(getNotesUseCase.execute(invalidPatientId)).rejects.toThrow();
  });
});
