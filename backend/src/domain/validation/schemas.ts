import { z } from 'zod';

export const createNoteSchema = z.object({
  patientId: z.string().uuid({ message: 'Invalid patient ID format' }).optional(),
  patientName: z.string().min(1, { message: 'Patient name is required' }).max(100, { message: 'Patient name must not exceed 100 characters' }),
  type: z.enum(['initial', 'interim', 'discharge'], {
    errorMap: () => ({ message: 'Type must be initial, interim, or discharge' }),
  }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' })
    .max(5000, { message: 'Content must not exceed 5000 characters' }),
});

export const patientIdSchema = z.string().uuid({ message: 'Invalid patient ID format' });

export type CreateNoteDTO = z.infer<typeof createNoteSchema>;
