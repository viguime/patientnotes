import { z } from 'zod';

export const noteFormSchema = z.object({
  patientId: z.string().optional(),
  patientName: z.string().min(1, { message: 'Patient name is required' }).max(100, { message: 'Patient name must not exceed 100 characters' }),
  type: z.enum(['initial', 'interim', 'discharge'], {
    errorMap: () => ({ message: 'Please select a note type' }),
  }),
  content: z
    .string()
    .min(10, { message: 'Content must be at least 10 characters' })
    .max(5000, { message: 'Content must not exceed 5000 characters' }),
}).refine((data) => {
  // If not initial assessment, patientId is required and must be valid UUID
  if (data.type !== 'initial' && (!data.patientId || data.patientId.trim() === '')) {
    return false;
  }
  // If patientId is provided and not empty, it must be a valid UUID
  if (data.patientId && data.patientId.trim() !== '') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(data.patientId);
  }
  return true;
}, {
  message: 'Invalid patient ID format',
  path: ['patientId'],
});

export type NoteFormData = z.infer<typeof noteFormSchema>;
