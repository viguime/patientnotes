import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { noteFormSchema, NoteFormData } from '../validation/schemas';
import { v4 as uuidv4 } from 'uuid';

interface NoteFormProps {
  onSubmit: (data: NoteFormData) => Promise<void>;
  isLoading?: boolean;
  selectedPatient?: { id: string; name: string } | null;
}

export const NoteForm: React.FC<NoteFormProps> = ({ onSubmit, isLoading = false, selectedPatient }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      patientId: '',
      patientName: '',
      type: 'initial',
      content: '',
    },
  });

  const noteType = watch('type');

  // Update form when a patient is selected
  useEffect(() => {
    if (selectedPatient) {
      setValue('patientId', selectedPatient.id);
      setValue('patientName', selectedPatient.name);
      setValue('type', 'interim'); // Default to interim when selecting existing patient
    }
  }, [selectedPatient, setValue]);

  // Clear patient ID when switching to initial assessment
  useEffect(() => {
    if (noteType === 'initial') {
      setValue('patientId', '');
    }
  }, [noteType, setValue]);

  const onFormSubmit = async (data: NoteFormData) => {
    // Auto-generate patient ID for initial assessments if not provided
    if (data.type === 'initial' && !data.patientId) {
      data.patientId = uuidv4();
    }
    await onSubmit(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Patient Note</h2>

      {/* Patient Name */}
      <div className="mb-4">
        <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
          Patient Name
        </label>
        <input
          {...register('patientName')}
          type="text"
          id="patientName"
          placeholder="e.g., John Doe"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.patientName ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.patientName && (
          <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
        )}
      </div>

      {/* Patient ID */}
      <div className="mb-4">
        <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
          Patient ID {noteType === 'initial' && <span className="text-gray-500 text-xs">(auto-generated)</span>}
        </label>
        <input
          {...register('patientId')}
          type="text"
          id="patientId"
          disabled={true}
          placeholder={noteType === 'initial' ? 'Auto-generated on submit' : 'Select a patient from notes below'}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed border-gray-300"
        />
        {errors.patientId && (
          <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
        )}
      </div>

      {/* Note Type */}
      <div className="mb-4">
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
          Note Type
        </label>
        <select
          {...register('type')}
          id="type"
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="initial">Initial Assessment</option>
          <option value="interim">Interim/Progress</option>
          <option value="discharge">Discharge</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>

      {/* Content */}
      <div className="mb-6">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Note Content
        </label>
        <textarea
          {...register('content')}
          id="content"
          rows={6}
          placeholder="Enter detailed patient notes here..."
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
            errors.content ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding Note...' : 'Add Note'}
      </button>
    </form>
  );
};
