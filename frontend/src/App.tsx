import React, { useState, useEffect, useCallback } from 'react';
import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { notesApi } from './services/api';
import { Note } from './types';
import { NoteFormData } from './validation/schemas';
import './styles/main.css';

export const PatientNotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);

  const fetchNotes = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotes = await notesApi.getNotesByPatientId(patientId);
      setNotes(fetchedNotes);
      setCurrentPatientId(patientId);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error('Error fetching notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (data: NoteFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newNote = await notesApi.createNote(data);
      
      // Use the patientId from the created note (could be auto-generated)
      const notePatientId = newNote.patientId;
      
      // If this is for the current patient, add to the list
      if (notePatientId === currentPatientId) {
        setNotes((prevNotes) => [newNote, ...prevNotes]);
      } else {
        // If switching patients, fetch all notes for this patient
        await fetchNotes(notePatientId);
      }
      
      // Update selected patient to the newly created note's patient
      setSelectedPatient({ id: newNote.patientId, name: newNote.patientName });
      
      // Show success feedback (optional)
      console.log('Note added successfully:', newNote);
    } catch (err) {
      setError('Failed to add note. Please check your input and try again.');
      console.error('Error creating note:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectPatient = (patientId: string, patientName: string) => {
    setSelectedPatient({ id: patientId, name: patientName });
    fetchNotes(patientId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Patient Notes</h1>
          <p className="mt-2 text-gray-600">
            Manage patient assessments including initial, interim, and discharge notes.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex text-red-400 hover:text-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Note Form */}
        <NoteForm 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting}
          selectedPatient={selectedPatient}
        />

        {/* Notes List */}
        <NotesList 
          notes={notes} 
          isLoading={isLoading}
          onSelectPatient={handleSelectPatient}
        />
      </div>
    </div>
  );
};

export default PatientNotesApp;
