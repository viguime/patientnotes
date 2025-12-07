import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createNoteRepository } from './infrastructure/config/database';
import { CreateNoteUseCase } from './domain/use-cases/CreateNoteUseCase';
import { GetNotesUseCase } from './domain/use-cases/GetNotesUseCase';
import { NotesController } from './presentation/controllers/NotesController';
import { createNotesRouter } from './presentation/routes/notesRoutes';
import { errorHandler } from './presentation/middlewares/errorHandler';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
    credentials: true,
  })
);

// Dependency Injection
const noteRepository = createNoteRepository();
const createNoteUseCase = new CreateNoteUseCase(noteRepository);
const getNotesUseCase = new GetNotesUseCase(noteRepository);
const notesController = new NotesController(createNoteUseCase, getNotesUseCase);

// Routes
app.use('/notes', createNotesRouter(notesController));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
