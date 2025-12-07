import React from 'react';
import { Note, NoteType } from '../types';

interface NotesListProps {
  notes: Note[];
  isLoading?: boolean;
  onSelectPatient?: (patientId: string, patientName: string) => void;
}

const noteTypeConfig: Record<NoteType, { label: string; color: string; bgColor: string }> = {
  initial: {
    label: 'Initial Assessment',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  interim: {
    label: 'Interim/Progress',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  discharge: {
    label: 'Discharge',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
};

export const NotesList: React.FC<NotesListProps> = ({ notes, isLoading = false, onSelectPatient }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No notes found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding a new patient note above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Notes</h2>
      
      <div className="space-y-4">
        {notes.map((note) => {
          const typeConfig = noteTypeConfig[note.type];
          return (
            <div
              key={note.id}
              onClick={() => onSelectPatient?.(note.patientId, note.patientName)}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-primary-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${typeConfig.bgColor} ${typeConfig.color}`}
                  >
                    {typeConfig.label}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">{note.patientName}</span>
                    <span className="text-xs text-gray-500 font-mono">Patient ID: {note.patientId}</span>
                  </div>
                </div>
                <time className="text-sm text-gray-500">{formatDate(note.createdAt)}</time>
              </div>
              
              <div className="mt-3">
                <p className="text-gray-800 whitespace-pre-wrap">{note.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
