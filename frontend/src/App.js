import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Achievements from './components/Achievements';
import AdminPanel from './components/AdminPanel';
import Statistics from './components/Statistics';
import AllAchievements from './components/AllAchievements';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './App.css';

function AppContent() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Apply theme class to body
  useEffect(() => {
    document.body.className = isDark ? 'dark' : 'light';
  }, [isDark]);

  const handleLogin = (username, isAdmin = false) => {
    setCurrentUser({ username, isAdmin });
    localStorage.setItem('currentUser', JSON.stringify({ username, isAdmin }));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Helper function to check if user is admin
  const isAdminUser = (user) => {
    return user && user.isAdmin;
  };

  return (
    <Router>
      <div className={`App min-h-screen transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? 
                (isAdminUser(currentUser) ? 
                  <Navigate to="/admin" replace /> : 
                  <Navigate to="/achievements" replace />
                ) : 
                <Login onLogin={handleLogin} isLoading={isLoading} setIsLoading={setIsLoading} />
            } 
          />
          <Route 
            path="/achievements" 
            element={
              currentUser ? 
                (isAdminUser(currentUser) ? 
                  <Navigate to="/admin" replace /> : 
                  <Achievements 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                ) : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/all-achievements" 
            element={
              currentUser ? 
                <AllAchievements 
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/admin" 
            element={
              currentUser ? 
                <AdminPanel 
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                /> : 
                <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/statistics" 
            element={
              currentUser ? 
                <Statistics 
                  currentUser={currentUser}
                  onLogout={handleLogout}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                /> : 
                <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 