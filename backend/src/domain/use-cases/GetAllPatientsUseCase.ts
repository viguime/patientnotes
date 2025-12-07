import { INoteRepository } from '../repositories/INoteRepository';

export class GetAllPatientsUseCase {
  constructor(private noteRepository: INoteRepository) {}

  async execute(): Promise<Array<{ id: string; name: string }>> {
    return this.noteRepository.findAllPatients();
  }
}
