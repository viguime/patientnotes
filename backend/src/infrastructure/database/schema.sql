-- Create notes table for PostgreSQL
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY,
  patient_id UUID NOT NULL,
  patient_name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('initial', 'interim', 'discharge')),
  content TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by patient_id
CREATE INDEX IF NOT EXISTS idx_notes_patient_id ON notes(patient_id);

-- Create index for sorting by created_at
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
