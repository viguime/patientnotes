# 🐳 Docker Setup Guide

## Prerequisites

You need Docker Desktop installed and running on macOS.

### Install Docker Desktop (if not already installed):

1. **Download Docker Desktop:**
   - Visit: https://www.docker.com/products/docker-desktop
   - Download for Mac (Apple Silicon if you have M1/M2/M3)

2. **Install Docker Desktop:**
   - Open the downloaded .dmg file
   - Drag Docker to Applications folder
   - Launch Docker Desktop from Applications
   - Follow the setup wizard

3. **Verify Docker is running:**
   ```bash
   docker --version
   docker-compose --version
   ```

## Quick Start with Docker

### Option 1: Automated Test Script

```bash
# Make sure Docker Desktop is running first!
./test-docker.sh
```

This script will:
- ✅ Stop any local development servers
- ✅ Build all Docker images
- ✅ Start all services (backend, frontend, PostgreSQL)
- ✅ Wait for health checks to pass
- ✅ Test all API endpoints
- ✅ Show you the status

### Option 2: Manual Docker Commands

```bash
# Stop local development servers
pkill -9 node

# Start Docker services
docker-compose up --build

# In another terminal, check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove all data
docker-compose down -v
```

## What's Different in Docker?

| Aspect | Local Dev | Docker |
|--------|-----------|--------|
| Backend | Development mode (hot-reload) | Production build |
| Frontend | webpack-dev-server | Nginx serving static files |
| Database | Your local PostgreSQL | PostgreSQL container |
| Database User | `viguime` | `postgres` |
| Database Password | (empty) | `postgres` |
| Environment | Development | Production |
| Build Time | Instant changes | Need to rebuild |

## Docker Services

The `docker-compose.yml` defines 3 services:

### 1. **backend** (Port 3000)
- Node.js 20 Alpine
- Production TypeScript build
- Connects to `postgres` service
- Health check on `/health`

### 2. **frontend** (Port 3001)
- Nginx Alpine
- Production React build
- Serves static files
- Module Federation enabled

### 3. **postgres** (Port 5432)
- PostgreSQL 16 Alpine
- Initialized with schema.sql
- Data persisted in Docker volume
- Credentials: postgres/postgres

## Switching Between Environments

### To Docker:
```bash
./test-docker.sh
```

### Back to Local Development:
```bash
./start-local.sh
```

Or manually:
```bash
docker-compose down
cd backend && npm run dev &
cd frontend && npm start &
```

## Troubleshooting

### Docker Desktop not running:
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```
**Solution:** Open Docker Desktop application

### Port already in use:
```
Bind for 0.0.0.0:3000 failed: port is already allocated
```
**Solution:** Stop local development servers first
```bash
pkill -9 node
lsof -ti:3000,3001 | xargs kill -9
```

### Build fails:
**Solution:** Clean everything and rebuild
```bash
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### Service won't start:
Check logs:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

## Testing the Docker Setup

Once services are running:

```bash
# Test backend health
curl http://localhost:3000/health

# Test endpoints
curl http://localhost:3000/notes/patients/all
curl http://localhost:3000/notes/all

# Create a test note
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "type": "initial",
    "content": "This is a test note from Docker"
  }'

# Access frontend
open http://localhost:3001
```

## Production Deployment

The Docker setup is production-ready and can be deployed to:
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Instances
- Any Kubernetes cluster
- DigitalOcean App Platform
- Heroku Container Registry

Just push your images to a container registry and deploy!

## Clean Up

```bash
# Stop all services
docker-compose down

# Remove all data (including database)
docker-compose down -v

# Remove all images
docker-compose down --rmi all
```

## Next Steps for Challenge Submission

1. ✅ Ensure Docker Desktop is running
2. ✅ Run `./test-docker.sh` successfully
3. ✅ Take screenshots of:
   - Terminal showing successful Docker build
   - `docker-compose ps` showing all services running
   - Browser showing the application working
   - Application creating and displaying notes
4. ✅ Include these in your challenge submission!

**Good luck with your challenge! 🚀**
