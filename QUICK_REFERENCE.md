# Quick Reference Card

## 🚀 Quick Start

```bash
# Option 1: Docker (Easiest)
docker-compose up --build

# Option 2: Setup Script
./setup.sh
# Then run manually (see below)

# Option 3: Manual
cd backend && npm install && npm run dev    # Terminal 1
cd frontend && npm install && npm start     # Terminal 2
```

## 🌐 Access URLs

- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- Health: http://localhost:3000/health

## 📋 Common Commands

### Backend
```bash
cd backend
npm run dev          # Development server
npm test            # Run tests
npm run build       # Build for production
npm start           # Run production build
```

### Frontend
```bash
cd frontend
npm start           # Development server (port 3001)
npm test            # Run tests
npm run build       # Build for production
```

### Docker
```bash
docker-compose up --build      # Build and start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
```

## 🧪 Test API

### Health Check
```bash
curl http://localhost:3000/health
```

### Create Note
```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "initial",
    "content": "Patient presented with fever and cough."
  }'
```

### Get Notes
```bash
curl http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000
```

## 📝 Note Types

- `initial` - Initial assessment (Blue)
- `interim` - Progress notes (Yellow)
- `discharge` - Discharge notes (Green)

## ✅ Validation Rules

- **Patient ID**: UUID format (e.g., 123e4567-e89b-12d3-a456-426614174000)
- **Type**: initial | interim | discharge
- **Content**: 10-5000 characters

## 🗂️ Project Structure

```
patientnotes/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── domain/         # Business logic
│   │   ├── infrastructure/ # Data access
│   │   └── presentation/   # HTTP layer
│   └── tests/              # Unit & integration tests
├── frontend/               # React app
│   ├── src/
│   │   ├── components/    # React components
│   │   └── services/      # API integration
│   └── webpack.config.js  # Module Federation
├── docker-compose.yml      # Docker orchestration
└── README.md              # Main documentation
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=3000
DB_TYPE=in-memory
CORS_ORIGIN=http://localhost:3001
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:3000
```

## 🐘 PostgreSQL Setup (Optional)

```bash
# 1. Create database
createdb patient_notes

# 2. Run schema
psql -d patient_notes -f backend/src/infrastructure/database/schema.sql

# 3. Update backend/.env
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=patient_notes
DB_USER=postgres
DB_PASSWORD=postgres

# 4. Restart backend
cd backend && npm run dev
```

## 🎨 Micro Frontend Integration

### Webpack Config (Host App)
```javascript
new ModuleFederationPlugin({
  remotes: {
    patientNotes: 'patientNotes@http://localhost:3001/remoteEntry.js'
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true }
  }
})
```

### Usage (Host App)
```tsx
const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

<Suspense fallback={<Loading />}>
  <PatientNotesApp />
</Suspense>
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Reset Everything
```bash
# Stop Docker
docker-compose down -v

# Clean backend
cd backend && rm -rf node_modules .env
cp .env.example .env && npm install

# Clean frontend
cd frontend && rm -rf node_modules .env
cp .env.example .env && npm install

# Restart
docker-compose up --build
```

### Cannot Connect to Backend
1. Check backend is running: `curl http://localhost:3000/health`
2. Check frontend .env: `REACT_APP_API_URL=http://localhost:3000`
3. Check browser console for errors
4. Verify CORS settings in backend

## 📚 Documentation Files

- `README.md` - Main documentation
- `backend/README.md` - Backend guide
- `frontend/README.md` - Frontend guide
- `MFE_INTEGRATION.md` - Micro Frontend integration
- `API_EXAMPLES.md` - API testing examples
- `TROUBLESHOOTING.md` - Common issues
- `PROJECT_SUMMARY.md` - Complete project overview
- `QUICK_REFERENCE.md` - This file

## 🧪 Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# With coverage
npm test -- --coverage
```

## 📦 Tech Stack

**Backend**: Node.js, Express, TypeScript, PostgreSQL, Zod, Jest
**Frontend**: React, TypeScript, Tailwind CSS, Webpack, Module Federation
**DevOps**: Docker, Docker Compose, Nginx

## ✨ Key Features

✅ Clean Architecture
✅ Input Validation (Frontend + Backend)
✅ Unit & Integration Tests
✅ Docker Support
✅ Micro Frontend Architecture
✅ PostgreSQL + In-Memory Storage
✅ Comprehensive Documentation

## 🎯 Challenge Requirements

✅ POST /notes
✅ GET /notes/:patientId
✅ PostgreSQL / In-memory
✅ Validation
✅ Clean Architecture
✅ React Form
✅ Notes List
✅ Unit Tests
✅ Dockerfile

## 💡 Tips

- Use `docker-compose` for easiest setup
- Run tests before committing
- Check `TROUBLESHOOTING.md` for issues
- Use `API_EXAMPLES.md` for testing
- See `MFE_INTEGRATION.md` for host integration

## 📞 Getting Help

1. Check `TROUBLESHOOTING.md`
2. Review error logs
3. Enable debug mode: `DEBUG=*`
4. Check browser console

---

**Created**: December 2025  
**Stack**: Node.js + React + TypeScript + Docker
