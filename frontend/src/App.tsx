import React, { useState, useEffect, useCallback } from 'react';
import { NoteForm } from './components/NoteForm';
import { NotesList } from './components/NotesList';
import { notesApi } from './services/api';
import { Note } from './types';
import { NoteFormData } from './validation/schemas';
import './styles/main.css';

export const PatientNotesApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [patients, setPatients] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPatientId, setCurrentPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'patient'>('all');

  // Load all patients and selected patient from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch all patients
        const allPatients = await notesApi.getAllPatients();
        setPatients(allPatients);

        // Load saved patient from localStorage
        const savedPatient = localStorage.getItem('selectedPatient');
        if (savedPatient) {
          const patient = JSON.parse(savedPatient);
          setSelectedPatient(patient);
          setViewMode('patient');
          fetchNotes(patient.id);
        } else {
          // If no saved patient, fetch all notes
          setViewMode('all');
          fetchAllNotes();
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        // Fallback to fetching all notes
        fetchAllNotes();
      }
    };
    loadData();
  }, []);

  const fetchAllNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedNotes = await notesApi.getAllNotes();
      setNotes(fetchedNotes);
      setCurrentPatientId(null);
    } catch (err) {
      setError('Failed to fetch notes. Please try again.');
      console.error('Error fetching all notes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      
      // Refresh patient list to include new patient if it's a new one
      const allPatients = await notesApi.getAllPatients();
      setPatients(allPatients);
      
      // Update selected patient to the newly created note's patient
      const patient = { id: newNote.patientId, name: newNote.patientName };
      setSelectedPatient(patient);
      setViewMode('patient');
      // Save to localStorage for persistence across page refreshes
      localStorage.setItem('selectedPatient', JSON.stringify(patient));
      
      // Fetch notes for this patient
      await fetchNotes(notePatientId);
      
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
    const patient = { id: patientId, name: patientName };
    setSelectedPatient(patient);
    setViewMode('patient');
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('selectedPatient', JSON.stringify(patient));
    fetchNotes(patientId);
  };

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      setViewMode('all');
      setSelectedPatient(null);
      localStorage.removeItem('selectedPatient');
      fetchAllNotes();
    } else {
      const patient = patients.find(p => p.id === value);
      if (patient) {
        handleSelectPatient(patient.id, patient.name);
      }
    }
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

        {/* Patient Selector */}
        <div className="mb-6 bg-white shadow rounded-lg p-4">
          <label htmlFor="patient-select" className="block text-sm font-medium text-gray-700 mb-2">
            Select Patient
          </label>
          <select
            id="patient-select"
            value={viewMode === 'all' ? 'all' : selectedPatient?.id || ''}
            onChange={handlePatientChange}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
          >
            <option value="all">All Patients</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.id})
              </option>
            ))}
          </select>
          {viewMode === 'all' && (
            <p className="mt-2 text-sm text-gray-500">
              Viewing notes for all patients
            </p>
          )}
          {viewMode === 'patient' && selectedPatient && (
            <p className="mt-2 text-sm text-gray-500">
              Viewing notes for {selectedPatient.name}
            </p>
          )}
        </div>

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
