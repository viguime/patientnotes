import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NoteForm } from '../components/NoteForm';

describe('NoteForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders form fields correctly', () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/patient id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/note content/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add note/i })).toBeInTheDocument();
  });

  it('patient ID field is always disabled', () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const patientIdInput = screen.getByLabelText(/patient id/i);
    expect(patientIdInput).toBeDisabled();
  });

  it('validates patient name is required', async () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const contentInput = screen.getByLabelText(/note content/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await act(async () => {
      await userEvent.type(contentInput, 'This is a test note with enough content.');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/patient name.*required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates content minimum length', async () => {
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/patient name/i);
    const contentInput = screen.getByLabelText(/note content/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await act(async () => {
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.type(contentInput, 'Short');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/content must be at least 10 characters/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data for initial assessment', async () => {
    mockOnSubmit.mockResolvedValue(undefined);
    render(<NoteForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/patient name/i);
    const typeSelect = screen.getByLabelText(/note type/i);
    const contentInput = screen.getByLabelText(/note content/i);
    const submitButton = screen.getByRole('button', { name: /add note/i });

    await act(async () => {
      await userEvent.type(nameInput, 'John Doe');
      await userEvent.selectOptions(typeSelect, 'initial');
      await userEvent.type(contentInput, 'Patient presenting with initial symptoms.');
      await userEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          patientName: 'John Doe',
          type: 'initial',
          content: 'Patient presenting with initial symptoms.',
        })
      );
      // Patient ID should be auto-generated (will be a UUID)
      const callArg = mockOnSubmit.mock.calls[0][0];
      expect(callArg.patientId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });
  });
});
