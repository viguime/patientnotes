# Patient Notes Application

A full-stack patient notes management application built with Node.js/Express backend and React frontend, designed with clean architecture principles and configured as a micro frontend module.

Code challenge for a Fullstack position

## 🎯 Challenge Requirements

✅ **Backend:**
- POST `/notes` - Create patient notes
- GET `/notes/:patientId` - Retrieve notes by patient ID
- GET `/notes/all` - Retrieve all notes across all patients
- GET `/notes/patients/all` - Retrieve all unique patients
- PostgreSQL with normalized schema (separate patients and notes tables)
- Input validation using Zod
- Clean architecture implementation

✅ **Frontend:**
- React form for creating notes
- Patient selector dropdown (view by patient or all patients)
- Automatic patient ID generation for initial assessments
- Click-to-select patient from notes list
- List view for displaying patient notes
- Tailwind CSS styling
- Micro Frontend architecture (Webpack Module Federation)
- LocalStorage persistence for selected patient

✅ **Bonus:**
- Unit tests (Jest for backend, Jest + React Testing Library for frontend)
- Dockerfiles for both backend and frontend
- Docker Compose for easy deployment

## 📁 Project Structure

```
patientnotes/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── domain/         # Business logic (entities, use cases)
│   │   ├── infrastructure/ # Data access (repositories, database)
│   │   └── presentation/   # HTTP layer (controllers, routes)
│   ├── tests/              # Unit and integration tests
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API integration
│   │   └── validation/    # Form validation schemas
│   ├── webpack.config.js  # Module Federation config
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Desktop (for containerized deployment)
- PostgreSQL 16 (for local development, or use Docker)

### Option 1: Using Docker (Bonus for Challenge Submission) ⭐

**Important:** Make sure Docker Desktop is running first!

```bash
# Clone the repository
cd patientnotes

# Run automated Docker setup and tests
./test-docker.sh

# Or manually:
docker-compose up --build

# Access the applications:
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# Health check: http://localhost:3000/health
```

**See [DOCKER.md](./DOCKER.md) for detailed Docker setup and troubleshooting.**

### Option 2: Manual Setup (Local Development)

**For active development with hot-reload:**

```bash
# Use the automated script
./start-local.sh

# Or manually:
```

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env to set DB_TYPE=postgres and your PostgreSQL credentials
npm run dev
```

Backend will run on `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Frontend will run on `http://localhost:3001`

#### PostgreSQL Setup (Local)

```bash
# Install PostgreSQL (if not already installed)
brew install postgresql@16

# Start PostgreSQL
brew services start postgresql@16

# Create database
/opt/homebrew/opt/postgresql@16/bin/createdb patient_notes

# Apply schema
/opt/homebrew/opt/postgresql@16/bin/psql patient_notes < backend/src/infrastructure/database/schema.sql
```

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test
```

Coverage report available in `backend/coverage/`

### Frontend Tests

```bash
cd frontend
npm test
```

## 📝 Note Types

The application supports three types of patient notes:

- **Initial** - Initial assessment notes
- **Interim** - Progress/interim notes during treatment
- **Discharge** - Discharge notes

## 🏗️ Architecture

### Backend - Clean Architecture

The backend follows Uncle Bob's Clean Architecture principles:

1. **Domain Layer** (Core Business Logic)
   - Entities: `Note` entity with business rules
   - Use Cases: `CreateNoteUseCase`, `GetNotesUseCase`, `GetAllNotesUseCase`, `GetAllPatientsUseCase`
   - Validation: Zod schemas for input validation

2. **Infrastructure Layer** (External Dependencies)
   - Repositories: `InMemoryNoteRepository`, `PostgresNoteRepository`
   - Database: PostgreSQL schema and configuration

3. **Presentation Layer** (HTTP Interface)
   - Controllers: `NotesController`
   - Routes: Express routes
   - Middleware: Error handling

**Benefits:**
- ✅ Testable business logic
- ✅ Framework independence
- ✅ Easy to swap data sources
- ✅ Clear separation of concerns

### Frontend - Micro Frontend

The frontend is built as a **Webpack Module Federation** module that can be:
- Used standalone
- Loaded into a host application as a remote module
- Shared across multiple applications

**Key Features:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Hook Form with Zod validation
- Axios for API calls

## 🔧 Configuration

### Backend Environment Variables

```env
PORT=3000
NODE_ENV=development
DB_TYPE=in-memory          # or 'postgres'
CORS_ORIGIN=http://localhost:3001

# PostgreSQL (if DB_TYPE=postgres)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patient_notes
DB_USER=postgres
DB_PASSWORD=postgres
```

### Frontend Environment Variables

```env
REACT_APP_API_URL=http://localhost:3000
```

## 🐘 PostgreSQL Setup

The application uses a **normalized relational database schema** with separate tables for patients and notes:

### Database Schema

**patients** table:
- `id` (UUID, PRIMARY KEY)
- `name` (VARCHAR(100), NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)

**notes** table:
- `id` (UUID, PRIMARY KEY)
- `patient_id` (UUID, FOREIGN KEY → patients.id, ON DELETE CASCADE)
- `type` (VARCHAR(20), CHECK constraint)
- `content` (TEXT, NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)

### Setup Instructions

To use PostgreSQL instead of in-memory storage:

1. **Using Docker Compose:**
   ```bash
   # Uncomment the postgres service in docker-compose.yml
   # Uncomment the postgres_data volume
   # Update backend environment: DB_TYPE=postgres
   docker-compose up --build
   ```

2. **Manual Setup:**
   ```bash
   # Create database
   createdb patient_notes
   
   # Run schema
   psql -d patient_notes -f backend/src/infrastructure/database/schema.sql
   
   # Update backend/.env
   DB_TYPE=postgres
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=patient_notes
   DB_USER=postgres
   DB_PASSWORD=postgres
   
   # Start backend
   cd backend && npm run dev
   ```

## 📡 API Documentation

### Create Note

```http
POST /notes
Content-Type: application/json

{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",  // Optional for initial assessments
  "patientName": "John Doe",
  "type": "initial",
  "content": "Patient presented with symptoms of fever and cough."
}
```

**Note:** For initial assessments, if `patientId` is omitted or empty, a new UUID will be auto-generated.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "patientName": "John Doe",
    "type": "initial",
    "content": "Patient presented with symptoms of fever and cough.",
    "createdAt": "2025-12-07T10:30:00.000Z"
  }
}
```

### Get Notes by Patient ID

```http
GET /notes/:patientId
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "456e7890-e89b-12d3-a456-426614174000",
      "patientId": "123e4567-e89b-12d3-a456-426614174000",
      "patientName": "John Doe",
      "type": "initial",
      "content": "Patient presented with symptoms of fever and cough.",
      "createdAt": "2025-12-07T10:30:00.000Z"
    }
  ]
}
```

### Get All Notes

```http
GET /notes/all
```

Returns all notes across all patients, ordered by creation date (newest first).

### Get All Patients

```http
GET /notes/patients/all
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe"
    },
    {
      "id": "789e0123-e89b-12d3-a456-426614174000",
      "name": "Jane Smith"
    }
  ]
}
```

## 🎨 Using as a Micro Frontend

### In a Host Application

1. **Configure Module Federation in host's webpack.config.js:**

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    patientNotes: 'patientNotes@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
  },
})
```

2. **Import and use in your host app:**

```tsx
import React, { lazy, Suspense } from 'react';

const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

function App() {
  return (
    <div>
      <h1>Healthcare Portal</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PatientNotesApp />
      </Suspense>
    </div>
  );
}
```

## 🧹 Validation Rules

### Patient ID
- Auto-generated for initial assessments
- Example: `123e4567-e89b-12d3-a456-426614174000`

### Patient Name
- Required for all note types
- Minimum: 1 character
- Maximum: 100 characters

### Note Type
- Must be one of: `initial`, `interim`, `discharge`

### Content
- Minimum: 10 characters
- Maximum: 5000 characters

## 🐳 Docker Commands

```bash
# Quick start with automated testing
./test-docker.sh

# Switch back to local development
./start-local.sh

# Manual Docker commands:
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Check service status
docker-compose ps

# Stop all services
docker-compose down

# Remove volumes (PostgreSQL data)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up backend

# Restart a service
docker-compose restart backend
```

**For complete Docker setup guide, see [DOCKER.md](./DOCKER.md)**

## 🧪 Testing

### Backend Test Coverage

- **21 tests passing** across 3 test suites
- **65% overall coverage**, 100% domain layer coverage
- Unit tests for use cases (CreateNoteUseCase, GetNotesUseCase, GetAllNotesUseCase, GetAllPatientsUseCase)
- Unit tests for repositories (InMemoryNoteRepository)
- Integration tests for all API endpoints
- Validation tests with Zod schemas

### Frontend Test Coverage

- **5 tests passing** in 1 test suite
- NoteForm component: 87% coverage
- Component rendering tests
- Form validation tests (required fields, content length)
- User interaction tests with React Testing Library
- Auto-ID generation verification

## 🔐 Security Features

- Input validation on both frontend and backend
- CORS configuration
- SQL injection prevention (parameterized queries)
- XSS prevention (React's built-in escaping)
- Security headers in Nginx

## 📈 Features & Future Enhancements

✅ **Implemented:**
- Patient selector with dropdown (view by patient or all)
- Auto-generated patient IDs for initial assessments
- Click-to-select patient from notes list
- Normalized database schema (separate patients/notes tables)
- LocalStorage persistence for selected patient
- Foreign key relationships with cascade delete

🔮 **Suggested Future Enhancements:**
- [ ] Authentication & authorization
- [ ] Advanced patient search and filtering
- [ ] Note editing and deletion
- [ ] File attachments
- [ ] Real-time updates (WebSockets)
- [ ] Audit logging
- [ ] Role-based access control
- [ ] Patient demographics and medical history

## 📄 License

MIT

## 👨‍💻 Development

This project was created as a coding challenge to demonstrate:
- Clean architecture principles
- Full-stack TypeScript development
- Micro frontend architecture
- Testing best practices
- Docker containerization
- Modern React patterns

---

**Author:** Victor Guimarães 
**Date:** December 2025  
**Tech Stack:** Node.js, Express, TypeScript, React, PostgreSQL, Docker, Webpack Module Federation, Tailwind CSS
