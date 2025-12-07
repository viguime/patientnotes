# Patient Notes Backend

Backend API for managing patient notes with clean architecture.

## Features

- ✅ POST `/notes` - Create a new patient note
- ✅ GET `/notes/:patientId` - Get all notes for a patient
- ✅ Clean Architecture (Entities, Use Cases, Repositories, Controllers)
- ✅ Input validation with Zod
- ✅ In-memory and PostgreSQL storage options
- ✅ Unit and integration tests with Jest
- ✅ Docker support

## Project Structure

```
backend/
├── src/
│   ├── domain/              # Business logic layer
│   │   ├── entities/        # Domain models (Note)
│   │   ├── use-cases/       # Business use cases
│   │   ├── repositories/    # Repository interfaces
│   │   └── validation/      # Zod schemas
│   ├── infrastructure/      # External dependencies
│   │   ├── repositories/    # Repository implementations
│   │   ├── config/          # Database configuration
│   │   └── database/        # SQL schemas
│   ├── presentation/        # HTTP layer
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # Express routes
│   │   ├── middlewares/     # Error handling
│   │   └── errors/          # Custom errors
│   └── app.ts               # Application entry point
├── tests/                   # Unit and integration tests
└── Dockerfile
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=3000
NODE_ENV=development
DB_TYPE=in-memory  # or 'postgres'
CORS_ORIGIN=http://localhost:3001
```

### 3. Database Setup (Optional - PostgreSQL)

If using PostgreSQL, set `DB_TYPE=postgres` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patient_notes
DB_USER=postgres
DB_PASSWORD=postgres
```

Run the schema:
```bash
psql -U postgres -d patient_notes -f src/infrastructure/database/schema.sql
```

## Running the Application

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t patient-notes-backend .
docker run -p 3000:3000 --env-file .env patient-notes-backend
```

## API Documentation

### Create Note

**POST** `/notes`

Request body:
```json
{
  "patientId": "123e4567-e89b-12d3-a456-426614174000",
  "type": "initial",
  "content": "Patient presented with symptoms of fever and cough."
}
```

Response:
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

**GET** `/notes/:patientId`

Response:
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

## Note Types

- `initial` - Initial assessment notes
- `interim` - Progress/interim notes
- `discharge` - Discharge notes

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Coverage Report

```bash
npm test
```

Coverage reports are generated in `coverage/` directory.

## Architecture

This backend follows **Clean Architecture** principles:

1. **Domain Layer** - Core business logic, independent of frameworks
2. **Infrastructure Layer** - Database, external services
3. **Presentation Layer** - HTTP controllers, routes, middleware

Benefits:
- ✅ Testable business logic
- ✅ Framework-independent core
- ✅ Easy to swap data sources
- ✅ Clear separation of concerns
