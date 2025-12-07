# Patient Notes Frontend

React-based frontend for managing patient notes, built as a Micro Frontend module using Webpack Module Federation.

## Features

- ✅ React 18 with TypeScript
- ✅ Tailwind CSS for styling
- ✅ React Hook Form with Zod validation
- ✅ Webpack Module Federation (Micro Frontend)
- ✅ Form for creating patient notes
- ✅ List view for displaying notes
- ✅ Unit tests with Jest and React Testing Library
- ✅ Docker support

## Project Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   │   ├── NoteForm.tsx
│   │   └── NotesList.tsx
│   ├── services/         # API integration
│   │   └── api.ts
│   ├── types/            # TypeScript types
│   ├── validation/       # Zod schemas
│   ├── styles/           # CSS/Tailwind
│   ├── __tests__/        # Unit tests
│   ├── App.tsx           # Main app component (exposed as MFE)
│   └── index.tsx         # Entry point
├── public/
│   └── index.html
├── webpack.config.js     # Webpack + Module Federation config
├── tailwind.config.js
└── Dockerfile
```

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:3000
```

## Running the Application

### Development Mode

```bash
npm start
```

The app will be available at `http://localhost:3001`

### Production Build

```bash
npm run build
```

Build output will be in `dist/` directory.

### Docker

```bash
docker build -t patient-notes-frontend .
docker run -p 8080:80 patient-notes-frontend
```

Access at `http://localhost:8080`

## Using as a Micro Frontend Module

This application is configured with Webpack Module Federation and can be loaded into a host application.

### Module Federation Configuration

The app exposes:
- **Module name**: `patientNotes`
- **Remote entry**: `remoteEntry.js`
- **Exposed component**: `./PatientNotesApp`

### Host Application Integration

In your host app's webpack config:

```javascript
new ModuleFederationPlugin({
  name: 'host',
  remotes: {
    patientNotes: 'patientNotes@http://localhost:3001/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
  },
})
```

In your host app code:

```tsx
import React, { lazy, Suspense } from 'react';

const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

function App() {
  return (
    <div>
      <h1>My Host Application</h1>
      <Suspense fallback={<div>Loading Patient Notes...</div>}>
        <PatientNotesApp />
      </Suspense>
    </div>
  );
}
```

## Features

### Note Form

- Patient ID input (UUID validation)
- Note type selector (initial, interim, discharge)
- Content textarea (min 10 characters, max 5000)
- Real-time validation feedback
- Auto-clear on successful submission

### Notes List

- Displays all notes for a patient
- Color-coded by note type:
  - Initial: Blue
  - Interim/Progress: Yellow
  - Discharge: Green
- Sorted by creation date (newest first)
- Empty state when no notes exist
- Loading state during API calls

## Testing

### Run All Tests

```bash
npm test
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

## Styling

This project uses **Tailwind CSS** with a custom configuration:

- Primary color: Blue (customizable in `tailwind.config.js`)
- Responsive design
- Accessibility-friendly focus states
- Consistent spacing and typography

## API Integration

The frontend communicates with the backend API:

- **POST** `/notes` - Create a new note
- **GET** `/notes/:patientId` - Get notes for a patient

All API calls are handled through the `notesApi` service in `src/services/api.ts`.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- No IE11 support

## Development Tips

### Hot Module Replacement

The dev server supports HMR for fast development:

```bash
npm start
```

### Type Checking

TypeScript is configured for strict mode:

```bash
npx tsc --noEmit
```

### Linting (optional)

To add ESLint:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL (default: `http://localhost:3000`)

## Deployment

### Static Hosting (Standalone)

Build and deploy the `dist/` folder to any static hosting service (Netlify, Vercel, S3, etc.)

### Nginx (Docker)

Use the included Dockerfile which serves the app via Nginx with:
- CORS headers for Module Federation
- Gzip compression
- Security headers
- Cache optimization

### CDN (Micro Frontend)

For Module Federation, deploy to a CDN and reference the `remoteEntry.js` file in your host application.
