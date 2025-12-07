# Troubleshooting Guide

Common issues and solutions for the Patient Notes application.

## Installation Issues

### npm install fails

**Problem:** `npm install` throws errors

**Solutions:**

1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check Node.js version:
   ```bash
   node -v  # Should be 18+ (20+ recommended)
   ```

4. Update npm:
   ```bash
   npm install -g npm@latest
   ```

## Backend Issues

### Port 3000 already in use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions:**

1. Find and kill the process:
   ```bash
   # macOS/Linux
   lsof -ti:3000 | xargs kill -9
   
   # Or change port in backend/.env
   PORT=3001
   ```

### Database connection fails (PostgreSQL)

**Problem:** `Error: connect ECONNREFUSED`

**Solutions:**

1. Verify PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   brew services start postgresql
   
   # Linux
   sudo systemctl status postgresql
   sudo systemctl start postgresql
   ```

2. Check database exists:
   ```bash
   psql -l | grep patient_notes
   
   # If not, create it:
   createdb patient_notes
   ```

3. Run the schema:
   ```bash
   psql -d patient_notes -f backend/src/infrastructure/database/schema.sql
   ```

4. Verify credentials in `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=patient_notes
   DB_USER=postgres
   DB_PASSWORD=postgres
   ```

### TypeScript compilation errors

**Problem:** `Cannot find module` or type errors

**Solutions:**

1. Reinstall dependencies:
   ```bash
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check tsconfig.json is present

3. Rebuild:
   ```bash
   npm run build
   ```

### Tests failing

**Problem:** Jest tests fail with import errors

**Solutions:**

1. Check jest.config.js exists

2. Install test dependencies:
   ```bash
   npm install --save-dev @types/jest @types/supertest
   ```

3. Run tests with verbose output:
   ```bash
   npm test -- --verbose
   ```

## Frontend Issues

### Port 3001 already in use

**Problem:** Webpack dev server can't start

**Solutions:**

1. Kill process on port 3001:
   ```bash
   lsof -ti:3001 | xargs kill -9
   ```

2. Or change port in webpack.config.js:
   ```javascript
   devServer: {
     port: 3002,
   }
   ```

### Webpack build fails

**Problem:** Build errors or module not found

**Solutions:**

1. Clear webpack cache:
   ```bash
   rm -rf node_modules/.cache
   ```

2. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. Check webpack.config.js syntax

### Tailwind CSS not working

**Problem:** Styles not applied

**Solutions:**

1. Verify tailwind.config.js exists

2. Check postcss.config.js exists

3. Ensure main.css imports Tailwind:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. Rebuild:
   ```bash
   npm run build
   ```

### CORS errors

**Problem:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**

1. Check backend CORS configuration in `backend/src/app.ts`:
   ```javascript
   cors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
   })
   ```

2. Update backend `.env`:
   ```env
   CORS_ORIGIN=http://localhost:3001
   ```

3. Restart backend server

### API calls fail

**Problem:** Cannot connect to backend

**Solutions:**

1. Verify backend is running:
   ```bash
   curl http://localhost:3000/health
   ```

2. Check frontend `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

3. Verify API URL in browser console

4. Check browser network tab for actual error

## Docker Issues

### Docker build fails

**Problem:** `docker-compose build` fails

**Solutions:**

1. Check Docker is running:
   ```bash
   docker ps
   ```

2. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

3. Build with no cache:
   ```bash
   docker-compose build --no-cache
   ```

### Container exits immediately

**Problem:** Container starts then stops

**Solutions:**

1. Check logs:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   ```

2. Check Dockerfile for errors

3. Verify environment variables

### Cannot connect between containers

**Problem:** Frontend can't reach backend

**Solutions:**

1. Use container names, not localhost:
   ```javascript
   // In docker-compose, use:
   REACT_APP_API_URL=http://backend:3000
   ```

2. Check they're on the same network:
   ```bash
   docker network inspect patientnotes_patient-notes-network
   ```

### Port conflicts

**Problem:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solutions:**

1. Change ports in docker-compose.yml:
   ```yaml
   ports:
     - "3002:3000"  # Use 3002 externally, 3000 internally
   ```

2. Or stop conflicting service:
   ```bash
   docker ps  # Find container ID
   docker stop <container-id>
   ```

## Module Federation Issues

### Remote module not loading

**Problem:** Host app can't load Patient Notes module

**Solutions:**

1. Verify remote is running:
   ```bash
   curl http://localhost:3001/remoteEntry.js
   ```

2. Check webpack.config.js remote configuration:
   ```javascript
   remotes: {
     patientNotes: 'patientNotes@http://localhost:3001/remoteEntry.js',
   }
   ```

3. Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)

4. Check browser console for specific errors

### React version conflicts

**Problem:** Multiple React instances

**Solutions:**

1. Ensure singleton configuration:
   ```javascript
   shared: {
     react: { singleton: true },
     'react-dom': { singleton: true },
   }
   ```

2. Check React versions match in host and remote:
   ```bash
   # In both apps
   npm list react react-dom
   ```

3. Update to same version:
   ```bash
   npm install react@18.2.0 react-dom@18.2.0
   ```

## Testing Issues

### Jest tests timeout

**Problem:** Tests hang or timeout

**Solutions:**

1. Increase timeout:
   ```javascript
   // In test file
   jest.setTimeout(10000);
   ```

2. Check for unresolved promises

3. Use `--detectOpenHandles`:
   ```bash
   npm test -- --detectOpenHandles
   ```

### Mock API not working

**Problem:** Tests can't mock axios

**Solutions:**

1. Install jest-mock-axios:
   ```bash
   npm install --save-dev jest-mock-axios
   ```

2. Or use MSW (Mock Service Worker):
   ```bash
   npm install --save-dev msw
   ```

## Performance Issues

### Slow build times

**Solutions:**

1. Enable webpack caching:
   ```javascript
   cache: {
     type: 'filesystem',
   }
   ```

2. Reduce bundle size:
   ```bash
   npm run build -- --analyze
   ```

3. Update dependencies:
   ```bash
   npm update
   ```

### Slow test execution

**Solutions:**

1. Run tests in parallel:
   ```bash
   npm test -- --maxWorkers=4
   ```

2. Use test coverage selectively:
   ```bash
   npm test -- --coverage=false
   ```

## Environment-Specific Issues

### Production build fails

**Solutions:**

1. Check environment variables are set

2. Build locally first:
   ```bash
   npm run build
   ```

3. Check build output for errors

4. Verify all dependencies are in `dependencies`, not `devDependencies`

### Different behavior in dev vs prod

**Solutions:**

1. Check environment-specific configs

2. Test production build locally:
   ```bash
   npm run build
   npx serve -s dist
   ```

3. Check for console.log or debugging code

## Getting Help

If these solutions don't work:

1. **Check the logs:**
   ```bash
   # Backend
   cd backend && npm run dev

   # Frontend  
   cd frontend && npm start
   
   # Docker
   docker-compose logs -f
   ```

2. **Enable debug mode:**
   ```env
   NODE_ENV=development
   DEBUG=*
   ```

3. **Check GitHub Issues:**
   - Search for similar issues
   - Open a new issue with:
     - Error message
     - Steps to reproduce
     - Environment (OS, Node version, etc.)
     - Logs

4. **Stack Overflow:**
   - Tag with: `node.js`, `react`, `webpack-module-federation`

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm test            # Run tests
npm run build       # Build for production
npm start           # Run production build

# Frontend
cd frontend
npm start           # Start dev server (port 3001)
npm test            # Run tests
npm run build       # Build for production

# Docker
docker-compose up --build      # Build and start all services
docker-compose down           # Stop all services
docker-compose logs -f        # Follow logs
docker-compose restart        # Restart services

# Debugging
node --inspect backend/src/app.ts    # Debug backend
npm test -- --watch                  # Watch tests
```

## Quick Reset

If everything is broken, start fresh:

```bash
# Stop all services
docker-compose down -v

# Clean backend
cd backend
rm -rf node_modules dist coverage .env
cp .env.example .env
npm install

# Clean frontend
cd ../frontend
rm -rf node_modules dist coverage .cache .env
cp .env.example .env
npm install

# Restart
cd ..
docker-compose up --build
```
