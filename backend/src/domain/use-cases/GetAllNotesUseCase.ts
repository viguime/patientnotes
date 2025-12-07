import { Note } from '../entities/Note';
import { INoteRepository } from '../repositories/INoteRepository';

export class GetAllNotesUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<Note[]> {
    return this.noteRepository.findAll();
  }
}
