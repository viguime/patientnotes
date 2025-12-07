#!/bin/bash

echo "🔄 Switching back to local development..."
echo ""

# Stop Docker containers
echo "1️⃣  Stopping Docker containers..."
docker-compose down

# Wait a moment
sleep 2

# Start local PostgreSQL if not running
echo "2️⃣  Checking PostgreSQL..."
if ! pgrep -f postgres > /dev/null; then
  echo "   Starting PostgreSQL..."
  brew services start postgresql@16
  sleep 3
fi

# Start backend
echo "3️⃣  Starting backend (port 3000)..."
cd /Users/viguime/projects/patientnotes/backend
npm run dev 2>&1 &
BACKEND_PID=$!

# Start frontend
echo "4️⃣  Starting frontend (port 3001)..."
cd /Users/viguime/projects/patientnotes/frontend
npm start 2>&1 &
FRONTEND_PID=$!

echo ""
echo "⏳ Waiting for services to start..."
sleep 8

# Check if services are running
echo ""
echo "🔍 Checking services..."
if lsof -i :3000 > /dev/null 2>&1; then
  echo "✅ Backend running on port 3000"
else
  echo "❌ Backend failed to start"
fi

if lsof -i :3001 > /dev/null 2>&1; then
  echo "✅ Frontend running on port 3001"
else
  echo "❌ Frontend failed to start"
fi

echo ""
echo "✨ Local development environment is running!"
echo ""
echo "📝 Access the application:"
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo ""
echo "📋 To stop services:"
echo "   pkill -9 node"
echo ""
