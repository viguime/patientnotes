import { CreateNoteUseCase } from '../../src/domain/use-cases/CreateNoteUseCase';
import { InMemoryNoteRepository } from '../../src/infrastructure/repositories/InMemoryNoteRepository';

describe('CreateNoteUseCase', () => {
  let createNoteUseCase: CreateNoteUseCase;
  let noteRepository: InMemoryNoteRepository;

  beforeEach(() => {
    noteRepository = new InMemoryNoteRepository();
    createNoteUseCase = new CreateNoteUseCase(noteRepository);
  });

  it('should create a valid note', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';
    const patientName = 'John Doe';
    const type = 'initial';
    const content = 'Patient presented with symptoms of fever and cough.';

    const note = await createNoteUseCase.execute(patientId, patientName, type, content);

    expect(note).toBeDefined();
    expect(note.id).toBeDefined();
    expect(note.patientId).toBe(patientId);
    expect(note.patientName).toBe(patientName);
    expect(note.type).toBe(type);
    expect(note.content).toBe(content);
    expect(note.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for invalid patient ID', async () => {
    const invalidPatientId = 'invalid-id';
    const patientName = 'John Doe';
    const type = 'interim';
    const content = 'Some content here that is long enough.';

    await expect(
      createNoteUseCase.execute(invalidPatientId, patientName, type, content)
    ).rejects.toThrow();
  });

  it('should throw error for invalid note type', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';
    const patientName = 'John Doe';
    const invalidType = 'invalid' as any;
    const content = 'Some content here that is long enough.';

    await expect(
      createNoteUseCase.execute(patientId, patientName, invalidType, content)
    ).rejects.toThrow();
  });

  it('should throw error for content too short', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';
    const patientName = 'John Doe';
    const type = 'initial';
    const shortContent = 'Short';

    await expect(
      createNoteUseCase.execute(patientId, patientName, type, shortContent)
    ).rejects.toThrow();
  });

  it('should save note to repository', async () => {
    const patientId = '123e4567-e89b-12d3-a456-426614174000';
    const patientName = 'Jane Smith';
    const type = 'interim';
    const content = 'Patient is responding well to treatment.';

    await createNoteUseCase.execute(patientId, patientName, type, content);

    const notes = await noteRepository.findByPatientId(patientId);
    expect(notes).toHaveLength(1);
    expect(notes[0].content).toBe(content);
    expect(notes[0].patientName).toBe(patientName);
  });

  it('should auto-generate patient ID for initial assessments when not provided', async () => {
    const patientName = 'New Patient';
    const type = 'initial';
    const content = 'First visit: Patient presents with new symptoms.';

    const note = await createNoteUseCase.execute(undefined, patientName, type, content);

    expect(note).toBeDefined();
    expect(note.patientId).toBeDefined();
    expect(note.patientId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    expect(note.patientName).toBe(patientName);
    expect(note.type).toBe(type);
  });

  it('should throw error when patient ID not provided for non-initial assessments', async () => {
    const patientName = 'Patient Name';
    const type = 'interim';
    const content = 'Follow-up visit content here.';

    await expect(
      createNoteUseCase.execute(undefined, patientName, type, content)
    ).rejects.toThrow('Patient ID is required for non-initial assessments');
  });
});
