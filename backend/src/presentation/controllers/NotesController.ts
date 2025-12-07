import { Request, Response, NextFunction } from 'express';
import { CreateNoteUseCase } from '../../domain/use-cases/CreateNoteUseCase';
import { GetNotesUseCase } from '../../domain/use-cases/GetNotesUseCase';

export class NotesController {
  constructor(
    private createNoteUseCase: CreateNoteUseCase,
    private getNotesUseCase: GetNotesUseCase
  ) {}

  createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, patientName, type, content } = req.body;

      const note = await this.createNoteUseCase.execute(patientId, patientName, type, content);

      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  };

  getNotesByPatientId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId } = req.params;

      const notes = await this.getNotesUseCase.execute(patientId);

      res.status(200).json({
        success: true,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  };
}
