import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteForm } from '../components/NoteForm';

describe('NoteForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/patient id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('validates patient ID format', async () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const patientIdInput = screen.getByLabelText(/patient id/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await userEvent.type(patientIdInput, 'invalid-id');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid patient id format/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates content minimum length', async () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const contentInput = screen.getByLabelText(/note content/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await userEvent.type(contentInput, 'Short');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/content must be at least 10 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const patientIdInput = screen.getByLabelText(/patient id/i);
    const typeSelect = screen.getByLabelText(/note type/i);
    const contentInput = screen.getByLabelText(/note content/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await userEvent.type(patientIdInput, '123e4567-e89b-12d3-a456-426614174000');
    await userEvent.selectOptions(typeSelect, 'interim');
    await userEvent.type(contentInput, 'Patient is responding well to treatment.');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        patientId: '123e4567-e89b-12d3-a456-426614174000',
        type: 'interim',
        content: 'Patient is responding well to treatment.',
      });
    });
  });

  it('clears form after successful submission', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const patientIdInput = screen.getByLabelText(/patient id/i) as HTMLInputElement;
    const contentInput = screen.getByLabelText(/note content/i) as HTMLTextAreaElement;
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await userEvent.type(patientIdInput, '123e4567-e89b-12d3-a456-426614174000');
    await userEvent.type(contentInput, 'This is a test note with enough content.');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(patientIdInput.value).toBe('');
      expect(contentInput.value).toBe('');
    });
  });
});
