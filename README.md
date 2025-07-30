# Achievements Management System

A full-stack application for managing user achievements with a FastAPI backend and React frontend.

## Features

- **Simple Login System**: Users can enter a username to "log in" (no password required)
- **Achievements Display**: View all available achievements with unlock status
- **Visual Status**: Achievements are visually distinguished between locked (grayed out) and unlocked states
- **Admin Panel**: Manage user achievements through a web interface
- **User Management**: Delete users and their achievements with confirmation
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Achievement status updates immediately

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and serialization
- **JSON Storage**: Simple file-based storage (can be replaced with a database)

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication

## Project Structure

```
achievements/
├── backend/
│   ├── main.py              # FastAPI application
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── public/
│   │   └── index.html      # Main HTML file
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service functions
│   │   ├── App.js          # Main App component
│   │   ├── App.css         # App styles
│   │   ├── index.js        # React entry point
│   │   └── index.css       # Global styles with Tailwind
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.js  # Tailwind configuration
│   └── postcss.config.js   # PostCSS configuration
└── README.md               # This file
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Automated Setup (Recommended)

#### Windows
1. Run `setup.bat` to install dependencies
2. Run `start.bat` to start the application
3. Open http://localhost:3000 in your browser

#### PowerShell
1. Run `setup.ps1` to install dependencies  
2. Run `start.ps1` to start the application
3. Open http://localhost:3000 in your browser

#### Linux/macOS
1. Make scripts executable: `chmod +x setup.sh start.sh stop.sh`
2. Run `./setup.sh` to install dependencies
3. Run `./start.sh` to start the application
4. Open http://localhost:3000 in your browser
5. Use `./stop.sh` to stop all services

### Manual Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the FastAPI server:
   ```bash
   python main.py
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

## Usage

1. **Login**: Enter any username to start using the application
2. **View Achievements**: See all available achievements with their unlock status
3. **Admin Panel**: Access the admin panel to manage user achievements
4. **Update Achievements**: Use the admin interface to unlock/lock achievements for users

## API Endpoints

### Backend API (http://localhost:8000)

- `POST /login` - User login (username only)
- `GET /achievements/{username}` - Get user's achievements with unlock status
- `GET /achievements` - Get all available achievements
- `GET /users` - Get all registered users
- `POST /admin/update-achievement` - Update user achievement status
- `DELETE /admin/delete-user/{username}` - Delete user and all their achievements

### API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Default Achievements

The system comes with 8 pre-configured achievements:
- First Steps
- Early Bird
- Night Owl
- Weekend Warrior
- Streak Master
- Social Butterfly
- Explorer
- Veteran

## Admin Usage

### Via Web Interface
1. Login with any username
2. Click "Admin Panel" in the top navigation
3. **Manage Achievements**: Select a user and achievement, choose to unlock or lock the achievement, then click "Update Achievement"
4. **Delete Users**: Select a user from the "Delete User" section, click "Delete User", and confirm the deletion

### Via API (Postman/cURL)

**Update Achievement:**
```bash
curl -X POST "http://localhost:8000/admin/update-achievement" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "your_username",
    "achievement_id": "first_login",
    "unlocked": true
  }'
```

**Delete User:**
```bash
curl -X DELETE "http://localhost:8000/admin/delete-user/username_to_delete"
```

## Customization

### Adding New Achievements
Edit the `default_achievements` list in `backend/main.py` to add new achievements.

### Styling
The frontend uses Tailwind CSS. Modify `frontend/src/index.css` and component files to customize the appearance.

### Storage
The backend uses JSON files for storage. For production, consider using a proper database like PostgreSQL or MongoDB.

## Development

### Backend Development
- The backend uses FastAPI with automatic API documentation
- Data is stored in JSON files: `users.json`, `achievements.json`, `user_achievements.json`
- CORS is enabled for the React frontend

### Frontend Development
- React components are in `frontend/src/components/`
- API service functions are in `frontend/src/services/api.js`
- Styling uses Tailwind CSS with custom CSS in `frontend/src/index.css`

## License

This project is open source and available under the MIT License. 