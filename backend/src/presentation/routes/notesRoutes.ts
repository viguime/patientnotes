import { Router } from 'express';
import { NotesController } from '../controllers/NotesController';

export const createNotesRouter = (notesController: NotesController): Router => {
  const router = Router();

  // POST /notes - Create a new note
  router.post('/', notesController.createNote);

  // GET /notes/:patientId - Get all notes for a patient
  router.get('/:patientId', notesController.getNotesByPatientId);

  return router;
};
