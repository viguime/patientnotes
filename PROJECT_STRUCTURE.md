# Project Structure

```
patientnotes/
│
├── backend/                          # Node.js/Express Backend
│   ├── src/
│   │   ├── domain/                  # 🏛️ Core Business Logic
│   │   │   ├── entities/
│   │   │   │   └── Note.ts         # Note entity model
│   │   │   ├── repositories/
│   │   │   │   └── INoteRepository.ts  # Repository interface
│   │   │   ├── use-cases/
│   │   │   │   ├── CreateNoteUseCase.ts  # Create note logic
│   │   │   │   └── GetNotesUseCase.ts    # Get notes logic
│   │   │   └── validation/
│   │   │       └── schemas.ts       # Zod validation schemas
│   │   │
│   │   ├── infrastructure/          # 🔌 External Dependencies
│   │   │   ├── config/
│   │   │   │   └── database.ts     # DB factory
│   │   │   ├── database/
│   │   │   │   └── schema.sql      # PostgreSQL schema
│   │   │   └── repositories/
│   │   │       ├── InMemoryNoteRepository.ts  # In-memory impl
│   │   │       └── PostgresNoteRepository.ts  # PostgreSQL impl
│   │   │
│   │   ├── presentation/            # 🌐 HTTP Layer
│   │   │   ├── controllers/
│   │   │   │   └── NotesController.ts  # Request handlers
│   │   │   ├── errors/
│   │   │   │   └── AppError.ts     # Custom error classes
│   │   │   ├── middlewares/
│   │   │   │   └── errorHandler.ts  # Global error handler
│   │   │   └── routes/
│   │   │       └── notesRoutes.ts   # Express routes
│   │   │
│   │   └── app.ts                   # Application entry point
│   │
│   ├── tests/                       # 🧪 Tests
│   │   ├── integration/
│   │   │   └── api.test.ts         # API endpoint tests
│   │   └── use-cases/
│   │       ├── CreateNoteUseCase.test.ts
│   │       └── GetNotesUseCase.test.ts
│   │
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   ├── Dockerfile                   # Docker build config
│   ├── jest.config.js               # Jest configuration
│   ├── package.json                 # Dependencies
│   ├── README.md                    # Backend documentation
│   └── tsconfig.json                # TypeScript config
│
├── frontend/                         # ⚛️ React Frontend
│   ├── public/
│   │   └── index.html               # HTML template
│   │
│   ├── src/
│   │   ├── __tests__/               # 🧪 Component tests
│   │   │   └── NoteForm.test.tsx
│   │   │
│   │   ├── components/              # 🎨 React Components
│   │   │   ├── NoteForm.tsx        # Form for creating notes
│   │   │   └── NotesList.tsx       # List for displaying notes
│   │   │
│   │   ├── services/                # 🔗 API Integration
│   │   │   └── api.ts              # Axios HTTP client
│   │   │
│   │   ├── styles/                  # 💅 Styles
│   │   │   └── main.css            # Tailwind CSS
│   │   │
│   │   ├── types/                   # 📝 TypeScript Types
│   │   │   └── index.ts            # Type definitions
│   │   │
│   │   ├── validation/              # ✅ Validation
│   │   │   └── schemas.ts          # Zod schemas
│   │   │
│   │   ├── App.tsx                  # Main app component (MFE)
│   │   ├── index.tsx                # Entry point
│   │   └── setupTests.ts            # Test setup
│   │
│   ├── .env                         # Environment variables
│   ├── .env.example                 # Environment template
│   ├── .gitignore                   # Git ignore rules
│   ├── Dockerfile                   # Docker build config
│   ├── jest.config.js               # Jest configuration
│   ├── nginx.conf                   # Nginx configuration
│   ├── package.json                 # Dependencies
│   ├── postcss.config.js            # PostCSS config
│   ├── README.md                    # Frontend documentation
│   ├── tailwind.config.js           # Tailwind config
│   ├── tsconfig.json                # TypeScript config
│   └── webpack.config.js            # Webpack + Module Federation
│
├── .gitignore                        # Root git ignore
├── API_EXAMPLES.md                   # 📡 API testing examples
├── docker-compose.yml                # 🐳 Docker orchestration
├── MFE_INTEGRATION.md                # 🔌 Micro Frontend guide
├── PROJECT_SUMMARY.md                # 📊 Complete project overview
├── QUICK_REFERENCE.md                # ⚡ Quick reference card
├── README.md                         # 📖 Main documentation
├── setup.sh                          # 🛠️ Setup automation script
└── TROUBLESHOOTING.md                # 🔧 Troubleshooting guide
```

## File Count

- **Backend**: 
  - Source files: 17 TypeScript files
  - Test files: 3 test files
  - Config files: 6 files
  - **Total**: 26 files

- **Frontend**: 
  - Source files: 9 TypeScript/TSX files
  - Test files: 2 test files
  - Config files: 8 files
  - **Total**: 19 files

- **Root Level**:
  - Documentation: 6 Markdown files
  - Config: 2 files (docker-compose.yml, .gitignore)
  - Scripts: 1 file (setup.sh)
  - **Total**: 9 files

**Grand Total**: 54+ files

## Key Directories

### Backend

- **`domain/`** - Pure business logic, no external dependencies
- **`infrastructure/`** - Database, repositories, external services
- **`presentation/`** - HTTP controllers, routes, middleware
- **`tests/`** - Unit and integration tests

### Frontend

- **`components/`** - Reusable React components
- **`services/`** - API calls and external integrations
- **`types/`** - TypeScript type definitions
- **`validation/`** - Form and data validation schemas

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│                  FRONTEND                        │
│  React + Tailwind + Module Federation           │
│  ┌────────────┐  ┌────────────┐                │
│  │  NoteForm  │  │ NotesList  │                │
│  └────────────┘  └────────────┘                │
│         │              │                         │
│         └──────┬───────┘                         │
│                │                                  │
│           API Service                            │
└────────────────┼────────────────────────────────┘
                 │ HTTP/JSON
                 │
┌────────────────┼────────────────────────────────┐
│                │         BACKEND                 │
│         Presentation Layer                       │
│  ┌─────────────────────────────┐                │
│  │  Routes → Controllers       │                │
│  └─────────────┬───────────────┘                │
│                │                                  │
│         Domain Layer                             │
│  ┌─────────────────────────────┐                │
│  │  Use Cases → Entities       │                │
│  └─────────────┬───────────────┘                │
│                │                                  │
│      Infrastructure Layer                        │
│  ┌─────────────────────────────┐                │
│  │  Repositories → Database    │                │
│  └─────────────┬───────────────┘                │
└────────────────┼────────────────────────────────┘
                 │
         ┌───────┴────────┐
         │                 │
    PostgreSQL        In-Memory
     Database           Map
```

## Technology Stack by Layer

### Frontend
- **UI**: React 18, Tailwind CSS
- **State**: React Hooks
- **Forms**: React Hook Form
- **Validation**: Zod
- **HTTP**: Axios
- **Bundler**: Webpack 5
- **MFE**: Module Federation

### Backend
- **Server**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Database**: PostgreSQL / In-Memory
- **Testing**: Jest + Supertest
- **Architecture**: Clean Architecture

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx (for frontend)
- **CI/CD Ready**: Dockerfiles included

## Data Flow

```
User Input (Form)
    ↓
Form Validation (Zod)
    ↓
API Call (Axios)
    ↓
Backend Route
    ↓
Controller
    ↓
Use Case (Business Logic)
    ↓
Repository Interface
    ↓
Repository Implementation
    ↓
Database (PostgreSQL / In-Memory)
    ↓
Response Back to User
```

## Module Federation Exposure

```
patientNotes (Remote Module)
    ↓
Exposes: ./PatientNotesApp
    ↓
Can be imported by Host Application
    ↓
Shared Dependencies: react, react-dom
```
