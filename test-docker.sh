#!/bin/bash

echo "🐳 Testing Docker Setup..."
echo ""

# Stop any running local processes
echo "1️⃣  Stopping local development servers..."
pkill -9 node 2>/dev/null
sleep 2

# Clean up any existing containers
echo "2️⃣  Cleaning up existing Docker containers..."
docker-compose down -v 2>/dev/null

# Build and start services
echo "3️⃣  Building and starting Docker services..."
echo "   This may take a few minutes on first run..."
docker-compose up --build -d

# Wait for services to be healthy
echo ""
echo "4️⃣  Waiting for services to be healthy..."
sleep 5

# Check backend health
echo ""
echo "🔍 Checking backend health..."
for i in {1..30}; do
  if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
    curl -s http://localhost:3000/health | jq .
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Backend failed to start"
    docker-compose logs backend
    exit 1
  fi
  echo "   Waiting... ($i/30)"
  sleep 2
done

# Check frontend
echo ""
echo "🔍 Checking frontend..."
for i in {1..30}; do
  if curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo "✅ Frontend is healthy!"
    break
  fi
  if [ $i -eq 30 ]; then
    echo "❌ Frontend failed to start"
    docker-compose logs frontend
    exit 1
  fi
  echo "   Waiting... ($i/30)"
  sleep 2
done

# Check database
echo ""
echo "🔍 Checking PostgreSQL..."
if docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ PostgreSQL is healthy!"
else
  echo "❌ PostgreSQL failed to start"
  docker-compose logs postgres
  exit 1
fi

# Test API endpoints
echo ""
echo "🔍 Testing API endpoints..."

echo "   Testing GET /notes/patients/all..."
PATIENTS=$(curl -s http://localhost:3000/notes/patients/all)
if echo "$PATIENTS" | grep -q "success"; then
  echo "   ✅ Patients endpoint working"
else
  echo "   ❌ Patients endpoint failed"
  echo "   Response: $PATIENTS"
fi

echo "   Testing GET /notes/all..."
NOTES=$(curl -s http://localhost:3000/notes/all)
if echo "$NOTES" | grep -q "success"; then
  echo "   ✅ Notes endpoint working"
else
  echo "   ❌ Notes endpoint failed"
  echo "   Response: $NOTES"
fi

# Show running containers
echo ""
echo "📊 Running containers:"
docker-compose ps

echo ""
echo "✨ Docker setup is complete!"
echo ""
echo "📝 Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo "   Health:   http://localhost:3000/health"
echo ""
echo "📋 Useful commands:"
echo "   View logs:        docker-compose logs -f"
echo "   Stop services:    docker-compose down"
echo "   Restart:          docker-compose restart"
echo "   Clean everything: docker-compose down -v"
echo ""
