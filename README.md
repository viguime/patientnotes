# Patient Notes Application

A full-stack patient notes management application built with Node.js/Express backend and React frontend, designed with clean architecture principles and configured as a micro frontend module.

## 🎯 Challenge Requirements

✅ **Backend:**
- POST `/notes` - Create patient notes
- GET `/notes/:patientId` - Retrieve notes by patient ID
- PostgreSQL support with in-memory fallback
- Input validation using Zod
- Clean architecture implementation

✅ **Frontend:**
- React form for creating notes
- List view for displaying patient notes
- Tailwind CSS styling
- Micro Frontend architecture (Webpack Module Federation)

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
- Docker & Docker Compose (optional)

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
cd patientnotes

# Start all services
docker-compose up --build

# Access the applications:
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# Health check: http://localhost:3000/health
```

### Option 2: Manual Setup

#### Backend

```bash
cd backend
npm install
cp .env.example .env
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
   - Use Cases: `CreateNoteUseCase`, `GetNotesUseCase`
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
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "initial",
  "content": "Patient presented with symptoms of fever and cough."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "456e7890-e89b-12d3-a456-426614174000",
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
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
      "type": "initial",
      "content": "Patient presented with symptoms of fever and cough.",
      "createdAt": "2025-12-07T10:30:00.000Z"
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
- Must be a valid UUID format
- Example: `123e4567-e89b-12d3-a456-426614174000`

### Note Type
- Must be one of: `initial`, `interim`, `discharge`

### Content
- Minimum: 10 characters
- Maximum: 5000 characters

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up --build

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Remove volumes (PostgreSQL data)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up backend
```

## 🧪 Testing

### Backend Test Coverage

- Unit tests for use cases
- Unit tests for repositories
- Integration tests for API endpoints
- Validation tests

### Frontend Test Coverage

- Component rendering tests
- Form validation tests
- User interaction tests
- API integration tests

## 🔐 Security Features

- Input validation on both frontend and backend
- CORS configuration
- SQL injection prevention (parameterized queries)
- XSS prevention (React's built-in escaping)
- Security headers in Nginx

## 📈 Future Enhancements

- [ ] Authentication & authorization
- [ ] Patient search functionality
- [ ] Note editing and deletion
- [ ] File attachments
- [ ] Real-time updates (WebSockets)
- [ ] Audit logging
- [ ] Role-based access control

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

**Author:** Your Name  
**Date:** December 2025  
**Tech Stack:** Node.js, Express, TypeScript, React, PostgreSQL, Docker, Webpack Module Federation, Tailwind CSS
