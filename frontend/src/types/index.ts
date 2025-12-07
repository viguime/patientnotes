export type NoteType = 'initial' | 'interim' | 'discharge';

export interface Note {
  id: string;
  patientId: string;
  patientName: string;
  type: NoteType;
  content: string;
  createdAt: string;
}

export interface CreateNoteRequest {
  patientId?: string;
  patientName: string;
  type: NoteType;
  content: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
