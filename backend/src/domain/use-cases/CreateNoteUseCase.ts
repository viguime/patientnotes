import { v4 as uuidv4 } from 'uuid';
import { NoteEntity, NoteType } from '../entities/Note';
import { INoteRepository } from '../repositories/INoteRepository';
import { createNoteSchema } from '../validation/schemas';

export class CreateNoteUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(patientId: string | undefined, patientName: string, type: NoteType, content: string): Promise<NoteEntity> {
    // Validate input
    const validatedData = createNoteSchema.parse({ patientId, patientName, type, content });

    // Auto-generate patientId for initial assessments if not provided
    const finalPatientId = validatedData.patientId || (type === 'initial' ? uuidv4() : '');
    
    if (!finalPatientId) {
      throw new Error('Patient ID is required for non-initial assessments');
    }

    // Create note entity
    const note = NoteEntity.create(
      uuidv4(),
      finalPatientId,
      validatedData.patientName,
      validatedData.type,
      validatedData.content
    );

    // Save to repository
    await this.noteRepository.save(note);

    return note;
  }
}
