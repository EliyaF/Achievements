#!/bin/bash

echo "🏆 Setting up Achievements Project for Linux..."

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Create virtual environment for Python backend
echo "🐍 Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
cd ..

# Install Node.js dependencies for frontend
echo "📦 Setting up React frontend..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the application, run:"
echo "  ./start.sh"
echo ""
echo "Or start components individually:"
echo "  Backend:   cd backend && source venv/bin/activate && python main.py"
echo "  Frontend:  cd frontend && npm start" 