import axios from 'axios';
import { Note, CreateNoteRequest, ApiResponse } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const notesApi = {
  createNote: async (noteData: CreateNoteRequest): Promise<Note> => {
    const response = await api.post<ApiResponse<Note>>('/notes', noteData);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to create note');
    }
    return response.data.data;
  },

  getNotesByPatientId: async (patientId: string): Promise<Note[]> => {
    const response = await api.get<ApiResponse<Note[]>>(`/notes/${patientId}`);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch notes');
    }
    return response.data.data;
  },
};
