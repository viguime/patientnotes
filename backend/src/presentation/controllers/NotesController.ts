import { Request, Response, NextFunction } from 'express';
import { CreateNoteUseCase } from '../../domain/use-cases/CreateNoteUseCase';
import { GetNotesUseCase } from '../../domain/use-cases/GetNotesUseCase';
import { GetAllNotesUseCase } from '../../domain/use-cases/GetAllNotesUseCase';
import { GetAllPatientsUseCase } from '../../domain/use-cases/GetAllPatientsUseCase';

export class NotesController {
  constructor(
    private createNoteUseCase: CreateNoteUseCase,
    private getNotesUseCase: GetNotesUseCase,
    private getAllNotesUseCase: GetAllNotesUseCase,
    private getAllPatientsUseCase: GetAllPatientsUseCase
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

  getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notes = await this.getAllNotesUseCase.execute();

      res.status(200).json({
        success: true,
        data: notes,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllPatients = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients = await this.getAllPatientsUseCase.execute();

      res.status(200).json({
        success: true,
        data: patients,
      });
    } catch (error) {
      next(error);
    }
  };
}
