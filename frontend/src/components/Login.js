import React, { useState } from 'react';
import { loginUser, getAllUsers } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Login = ({ onLogin, isLoading, setIsLoading }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingUser, setPendingUser] = useState('');
  const { isDark } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter a username');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Check if user is admin
      const isAdmin = username.trim().toLowerCase() === 'admin';
      
      if (isAdmin) {
        // Admin user - proceed directly without checking existing users
        await loginUser(username.trim());
        onLogin(username.trim(), true); // Pass isAdmin = true
        return;
      }

      // Check if user already exists (for non-admin users)
      const usersResponse = await getAllUsers();
      const existingUsers = usersResponse.users;
      const userExists = existingUsers.some(user => user.username === username.trim());
      
      if (!userExists) {
        // Show confirmation dialog for new user
        setPendingUser(username.trim());
        setShowConfirmation(true);
        return;
      }
      
      // User exists, proceed with login
      await loginUser(username.trim());
      onLogin(username.trim(), false); // Pass isAdmin = false
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmNewUser = async () => {
    setIsLoading(true);
    setError('');

    try {
      await loginUser(pendingUser);
      onLogin(pendingUser, false); // Pass isAdmin = false for new users
      setShowConfirmation(false);
      setPendingUser('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelNewUser = () => {
    setShowConfirmation(false);
    setPendingUser('');
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className={`rounded-2xl p-8 shadow-2xl transition-all duration-300 ${
          isDark 
            ? 'glass-effect' 
            : 'bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl'
        }`}>
          <div className="text-center">
            <h1 className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              🏆 Achievements
            </h1>
            <p className={`text-lg mb-8 transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-600'
            }`}>
              Track your progress and unlock achievements
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Enter your username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-300' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
                }`}
                placeholder="Your username"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className={`border rounded-lg p-3 transition-colors duration-300 ${
                isDark 
                  ? 'bg-red-500/20 border-red-500/30' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <p className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-red-200' : 'text-red-700'
                }`}>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                'התחברות'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className={`text-sm transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-500'
            }`}>
              אין צורך בסיסמא :)
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl transition-all duration-300 ${
            isDark 
              ? 'glass-effect' 
              : 'bg-white/95 backdrop-blur-sm border border-gray-200'
          }`}>
            <div className="text-center">
              <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Create New User?
              </h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-600'
              }`}>
                The user <strong className={isDark ? 'text-white' : 'text-gray-900'}>{pendingUser}</strong> doesn't exist yet. 
                Would you like to create this user account?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelNewUser}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmNewUser}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 