import request from 'supertest';
import express, { Application } from 'express';
import { createNoteRepository } from '../../src/infrastructure/config/database';
import { CreateNoteUseCase } from '../../src/domain/use-cases/CreateNoteUseCase';
import { GetNotesUseCase } from '../../src/domain/use-cases/GetNotesUseCase';
import { GetAllNotesUseCase } from '../../src/domain/use-cases/GetAllNotesUseCase';
import { GetAllPatientsUseCase } from '../../src/domain/use-cases/GetAllPatientsUseCase';
import { NotesController } from '../../src/presentation/controllers/NotesController';
import { createNotesRouter } from '../../src/presentation/routes/notesRoutes';
import { errorHandler } from '../../src/presentation/middlewares/errorHandler';
import { InMemoryNoteRepository } from '../../src/infrastructure/repositories/InMemoryNoteRepository';

describe('Notes API Endpoints', () => {
  let app: Application;
  let repository: InMemoryNoteRepository;

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Use in-memory repository for testing
    repository = new InMemoryNoteRepository();
    const createNoteUseCase = new CreateNoteUseCase(repository);
    const getNotesUseCase = new GetNotesUseCase(repository);
    const getAllNotesUseCase = new GetAllNotesUseCase(repository);
    const getAllPatientsUseCase = new GetAllPatientsUseCase(repository);
    const notesController = new NotesController(
      createNoteUseCase, 
      getNotesUseCase,
      getAllNotesUseCase,
      getAllPatientsUseCase
    );

    app.use('/notes', createNotesRouter(notesController));
    app.use(errorHandler);
  });

  describe('POST /notes', () => {
    it('should create a new note', async () => {
      const noteData = {
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        patientName: 'John Doe',
        type: 'initial',
        content: 'Patient presented with symptoms of fever and persistent cough.',
      };

      const response = await request(app)
        .post('/notes')
        .send(noteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.patientId).toBe(noteData.patientId);
      expect(response.body.data.patientName).toBe(noteData.patientName);
      expect(response.body.data.type).toBe(noteData.type);
      expect(response.body.data.content).toBe(noteData.content);
      expect(response.body.data.id).toBeDefined();
    });

    it('should return 400 for invalid patient ID', async () => {
      const noteData = {
        patientId: 'invalid-id',
        patientName: 'John Doe',
        type: 'interim',
        content: 'Some content here that is long enough.',
      };

      const response = await request(app)
        .post('/notes')
        .send(noteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/notes')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /notes/:patientId', () => {
    it('should return notes for a patient', async () => {
      const patientId = '123e4567-e89b-12d3-a456-426614174000';

      // Create some notes first
      await request(app).post('/notes').send({
        patientId,
        patientName: 'Jane Smith',
        type: 'initial',
        content: 'Initial assessment of patient condition.',
      });

      await request(app).post('/notes').send({
        patientId,
        patientName: 'Jane Smith',
        type: 'interim',
        content: 'Patient showing signs of improvement.',
      });

      const response = await request(app)
        .get(`/notes/${patientId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array for patient with no notes', async () => {
      const patientId = '223e4567-e89b-12d3-a456-426614174000';

      const response = await request(app)
        .get(`/notes/${patientId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it('should return 400 for invalid patient ID', async () => {
      const response = await request(app)
        .get('/notes/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /notes/all', () => {
    it('should return all notes across all patients', async () => {
      // Create notes for different patients
      await repository.save({
        id: '1',
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        patientName: 'John Doe',
        type: 'initial',
        content: 'Initial assessment for John',
        createdAt: new Date(),
      });

      await repository.save({
        id: '2',
        patientId: '223e4567-e89b-12d3-a456-426614174000',
        patientName: 'Jane Smith',
        type: 'initial',
        content: 'Initial assessment for Jane',
        createdAt: new Date(),
      });

      const response = await request(app)
        .get('/notes/all')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return empty array when no notes exist', async () => {
      const response = await request(app)
        .get('/notes/all')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /notes/patients/all', () => {
    it('should return all unique patients', async () => {
      // Create notes for different patients
      await repository.save({
        id: '1',
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        patientName: 'John Doe',
        type: 'initial',
        content: 'Initial assessment',
        createdAt: new Date(),
      });

      await repository.save({
        id: '2',
        patientId: '223e4567-e89b-12d3-a456-426614174000',
        patientName: 'Jane Smith',
        type: 'initial',
        content: 'Initial assessment',
        createdAt: new Date(),
      });

      // Add another note for the same patient
      await repository.save({
        id: '3',
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        patientName: 'John Doe',
        type: 'interim',
        content: 'Follow up',
        createdAt: new Date(),
      });

      const response = await request(app)
        .get('/notes/patients/all')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data).toEqual(
        expect.arrayContaining([
          { id: '123e4567-e89b-12d3-a456-426614174000', name: 'John Doe' },
          { id: '223e4567-e89b-12d3-a456-426614174000', name: 'Jane Smith' },
        ])
      );
    });

    it('should return empty array when no patients exist', async () => {
      const response = await request(app)
        .get('/notes/patients/all')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });
});
