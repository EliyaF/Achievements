import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ currentUser, onLogout, title, subtitle }) => {
  const { isDark } = useTheme();
  const location = useLocation();

  // Helper function to check if user is admin
  const isAdminUser = (user) => {
    return user && user.isAdmin;
  };

  // Helper function to check if current path matches
  const isCurrentPath = (path) => {
    return location.pathname === path;
  };

  // Helper function to get button styling based on active state
  const getButtonStyle = (isActive, baseGradient, hoverGradient) => {
    if (isActive) {
      return `w-20 px-4 py-2.5 bg-gradient-to-r ${baseGradient} text-white rounded-xl transition-all duration-300 font-medium shadow-lg text-center text-sm font-semibold cursor-default border-2 border-white`;
    }
    return `w-20 px-4 py-2.5 bg-gradient-to-r ${baseGradient} hover:${hoverGradient} text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 text-center text-sm font-semibold`;
  };

  return (
    <div className="relative overflow-hidden">
      <div className={`absolute inset-0 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20' 
          : 'bg-gradient-to-r from-purple-200/30 to-blue-200/30'
      }`}></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-xl">🏆</span>
              </div>
              <div>
                <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>{title}</h1>
                {subtitle && (
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-purple-200' : 'text-purple-700'
                  }`}>{subtitle}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-purple-200' : 'text-purple-700'
              }`}>Welcome back</p>
              <p className={`font-semibold transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{currentUser.username}</p>
            </div>
            <div className="flex space-x-3">
              {/* Home/Achievements Button - Always show for non-admin users */}
              {!isAdminUser(currentUser) && (
                <Link
                  to="/achievements"
                  className={getButtonStyle(
                    isCurrentPath('/achievements'),
                    'from-green-500 to-emerald-600',
                    'from-green-600 to-emerald-700'
                  )}
                  title="Achievements"
                >
                  Home
                </Link>
              )}

              {/* Stats Button - Always show */}
              <Link
                to="/statistics"
                className={getButtonStyle(
                  isCurrentPath('/statistics'),
                  'from-teal-500 to-cyan-600',
                  'from-teal-600 to-cyan-700'
                )}
                title="Statistics"
              >
                Stats
              </Link>
              
              {/* All Achievements Button - Always show */}
              <Link
                to="/all-achievements"
                className={getButtonStyle(
                  isCurrentPath('/all-achievements'),
                  'from-orange-500 to-yellow-600',
                  'from-orange-600 to-yellow-700'
                )}
                title="All Achievements"
              >
                All
              </Link>

              {/* Admin Button - Show for admin users */}
              {isAdminUser(currentUser) && (
                <Link
                  to="/admin"
                  className={getButtonStyle(
                    isCurrentPath('/admin'),
                    'from-purple-500 to-blue-500',
                    'from-purple-600 to-blue-600'
                  )}
                  title="Admin Panel"
                >
                  Admin
                </Link>
              )}

              <button
                onClick={onLogout}
                className="w-20 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl hover:scale-105 text-center text-sm font-semibold"
                title="Logout"
              >
                Exit
              </button>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 