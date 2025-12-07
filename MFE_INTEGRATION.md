# Patient Notes - Micro Frontend Integration Guide

This guide explains how to integrate the Patient Notes application into your micro frontend host application.

## Architecture Overview

The Patient Notes app is built using **Webpack Module Federation**, allowing it to be:
- Developed and deployed independently
- Loaded dynamically at runtime into a host application
- Shared with other micro frontends

## Integration Steps

### 1. Prerequisites

Your host application needs:
- Webpack 5+
- React 18+
- Module Federation plugin

### 2. Configure Module Federation in Host

In your host app's `webpack.config.js`:

```javascript
const { ModuleFederationPlugin } = require('webpack').container;

module.exports = {
  // ... other config
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        patientNotes: 'patientNotes@http://localhost:3001/remoteEntry.js',
        // In production: 'patientNotes@https://your-cdn.com/patient-notes/remoteEntry.js'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: false,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '^18.2.0',
          eager: false,
        },
      },
    }),
  ],
};
```

### 3. Import and Use in Host App

```tsx
import React, { lazy, Suspense } from 'react';

// Lazy load the remote module
const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

function HealthcarePortal() {
  return (
    <div className="portal">
      <header>
        <h1>Healthcare Management System</h1>
      </header>
      
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <PatientNotesApp />
        </Suspense>
      </main>
    </div>
  );
}
```

### 4. TypeScript Support (Optional)

Create type declarations for the remote module:

```typescript
// src/types/patient-notes.d.ts
declare module 'patientNotes/PatientNotesApp' {
  const PatientNotesApp: React.ComponentType;
  export default PatientNotesApp;
}
```

## Deployment Strategies

### Development

Run both host and remote apps locally:

```bash
# Terminal 1: Patient Notes app
cd patientnotes/frontend
npm start
# Runs on http://localhost:3001

# Terminal 2: Host app
cd your-host-app
npm start
# Runs on http://localhost:3000
```

### Production

#### Option 1: Separate Deployments

1. **Deploy Patient Notes to CDN:**
   ```bash
   cd patientnotes/frontend
   npm run build
   # Upload dist/ to CDN (S3, Cloudfront, etc.)
   ```

2. **Update host's remote URL:**
   ```javascript
   remotes: {
     patientNotes: 'patientNotes@https://cdn.example.com/patient-notes/remoteEntry.js'
   }
   ```

#### Option 2: Docker with Nginx

```yaml
# docker-compose.yml
services:
  patient-notes-mfe:
    build: ./patientnotes/frontend
    ports:
      - "3001:80"
    
  host-app:
    build: ./your-host-app
    ports:
      - "3000:80"
    environment:
      - PATIENT_NOTES_URL=http://patient-notes-mfe:80/remoteEntry.js
```

## Advanced Patterns

### 1. Error Boundaries

Wrap the remote component in an error boundary:

```tsx
import { ErrorBoundary } from 'react-error-boundary';

function App() {
  return (
    <ErrorBoundary
      fallback={<div>Failed to load Patient Notes module</div>}
      onError={(error) => console.error('MFE Error:', error)}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <PatientNotesApp />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 2. Conditional Loading

Load the module only when needed:

```tsx
function App() {
  const [showPatientNotes, setShowPatientNotes] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPatientNotes(true)}>
        Open Patient Notes
      </button>
      
      {showPatientNotes && (
        <Suspense fallback={<LoadingSpinner />}>
          <PatientNotesApp />
        </Suspense>
      )}
    </div>
  );
}
```

### 3. Routing Integration

Integrate with React Router:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route 
          path="/patient-notes" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PatientNotesApp />
            </Suspense>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
```

## Communication Between Micro Frontends

### Using Custom Events

In Patient Notes app:
```tsx
// Emit event when note is created
const handleNoteCreated = (note) => {
  window.dispatchEvent(new CustomEvent('note-created', { detail: note }));
};
```

In Host app:
```tsx
// Listen for events
useEffect(() => {
  const handleNoteCreated = (event) => {
    console.log('New note created:', event.detail);
    // Update global state, show notification, etc.
  };
  
  window.addEventListener('note-created', handleNoteCreated);
  return () => window.removeEventListener('note-created', handleNoteCreated);
}, []);
```

### Using Shared State (Advanced)

For more complex scenarios, consider:
- Redux with shared store
- Context API providers
- State management libraries (Zustand, Jotai)

## Versioning Strategy

### Semantic Versioning

1. **Major version** (1.0.0 → 2.0.0): Breaking changes
2. **Minor version** (1.0.0 → 1.1.0): New features, backward compatible
3. **Patch version** (1.0.0 → 1.0.1): Bug fixes

### URL Versioning

```javascript
remotes: {
  patientNotes: 'patientNotes@https://cdn.example.com/patient-notes/v1/remoteEntry.js'
}
```

## Performance Optimization

### 1. Lazy Loading

Only load when needed:
```tsx
const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));
```

### 2. Code Splitting

Module Federation automatically splits code, but you can optimize further:
```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
  },
}
```

### 3. Caching Strategy

In Nginx config:
```nginx
# Cache remoteEntry.js for 5 minutes
location /remoteEntry.js {
  expires 5m;
}

# Cache other assets for 1 year
location ~* \.(js|css)$ {
  expires 1y;
}
```

## Troubleshooting

### Module Not Found

**Error:** `Module not found: Can't resolve 'patientNotes/PatientNotesApp'`

**Solution:**
- Verify the remote app is running
- Check the remote URL in webpack config
- Ensure `remoteEntry.js` is accessible

### React Version Mismatch

**Error:** Multiple React instances detected

**Solution:**
```javascript
shared: {
  react: { singleton: true },
  'react-dom': { singleton: true },
}
```

### CORS Issues

**Error:** Cross-Origin Request Blocked

**Solution:** Enable CORS in Nginx (already configured in patient-notes):
```nginx
add_header Access-Control-Allow-Origin "*";
```

## Best Practices

1. ✅ Use error boundaries
2. ✅ Implement loading states
3. ✅ Version your remote modules
4. ✅ Use singleton for shared dependencies
5. ✅ Monitor performance metrics
6. ✅ Test integration regularly
7. ✅ Document breaking changes
8. ✅ Implement graceful degradation

## Example: Complete Integration

Here's a complete example of a host app integrating Patient Notes:

```tsx
// App.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

const PatientNotesApp = lazy(() => import('patientNotes/PatientNotesApp'));

function ErrorFallback({ error }) {
  return (
    <div className="error">
      <h2>Failed to load Patient Notes</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}

function LoadingSpinner() {
  return <div className="spinner">Loading Patient Notes...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/patient-notes">Patient Notes</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/patient-notes"
            element={
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<LoadingSpinner />}>
                  <PatientNotesApp />
                </Suspense>
              </ErrorBoundary>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
```

## Support

For issues or questions:
- Check the main README.md
- Review the frontend/README.md
- Open an issue in the repository

---

**Happy Micro Frontend Development! 🚀**
