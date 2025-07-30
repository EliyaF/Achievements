#!/bin/bash

echo "🛑 Stopping Achievements Application..."

# Kill Python processes (backend)
echo "🔧 Stopping backend server..."
pkill -f "python main.py" 2>/dev/null
pkill -f "uvicorn" 2>/dev/null

# Kill Node processes (frontend)
echo "⚛️  Stopping React development server..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Kill any remaining processes on the ports
echo "🧹 Cleaning up port usage..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:8000 | xargs kill -9 2>/dev/null

echo "✅ All processes stopped!" 