import { Note } from '../entities/Note';
import { INoteRepository } from '../repositories/INoteRepository';
import { patientIdSchema } from '../validation/schemas';

export class GetNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(patientId: string): Promise<Note[]> {
    // Validate patient ID
    const validatedPatientId = patientIdSchema.parse(patientId);

    // Retrieve notes from repository
    const notes = await this.noteRepository.findByPatientId(validatedPatientId);

    // Sort by creation date (newest first)
    return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}
