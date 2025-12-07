#!/bin/bash

# Patient Notes Application - Setup Script
# This script helps set up the development environment

set -e

echo "🏥 Patient Notes Application - Setup"
echo "======================================"
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version is $NODE_VERSION. Recommended: 20+"
fi

echo "✅ Node.js $(node -v) detected"
echo "✅ npm $(npm -v) detected"
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "📦 Installing backend dependencies..."
npm install

echo "✅ Backend setup complete!"
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend

if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "✅ Frontend setup complete!"
echo ""

cd ..

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo ""
echo "Option 1: Run with Docker Compose (recommended)"
echo "  docker-compose up --build"
echo ""
echo "Option 2: Run manually in separate terminals"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm start"
echo ""
echo "Access:"
echo "  Frontend: http://localhost:3001"
echo "  Backend:  http://localhost:3000"
echo "  Health:   http://localhost:3000/health"
echo ""
echo "To run tests:"
echo "  Backend:  cd backend && npm test"
echo "  Frontend: cd frontend && npm test"
echo ""
