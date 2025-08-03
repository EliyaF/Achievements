import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllAchievements, updateUserAchievement, deleteUser } from '../services/api';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

const AdminPanel = ({ currentUser, onLogout, isLoading, setIsLoading }) => {
  const [users, setUsers] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [userAchievements, setUserAchievements] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [userToDelete, setUserToDelete] = useState('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
    const { isDark } = useTheme();

  // Helper function to check if user is admin
  const isAdminUser = (username) => {
    return username === 'admin';
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchUserAchievements(selectedUser);
    }
  }, [selectedUser]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [usersData, achievementsData] = await Promise.all([
        getAllUsers(),
        getAllAchievements()
      ]);
      
      setUsers(usersData.users);
      setAchievements(achievementsData.achievements);
      
      // Set default to empty - user must select a user
      setSelectedUser('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAchievements = async (username) => {
    try {
      const response = await fetch(`http://localhost:8000/achievements/${username}`);
      const data = await response.json();
      
      // Create a map of achievement ID to unlock status
      const achievementMap = {};
      data.achievements.forEach(achievement => {
        achievementMap[achievement.id] = achievement.unlocked;
      });
      
      setUserAchievements(achievementMap);
    } catch (err) {
      console.error('Failed to fetch user achievements:', err);
    }
  };

  const handleToggleAchievement = async (achievementId) => {
    if (!selectedUser) {
      setError('Please select a user first');
      return;
    }

    // Prevent managing admin user achievements
    if (isAdminUser(selectedUser)) {
      setError('Cannot manage achievements for admin user');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const currentStatus = userAchievements[achievementId] || false;
      await updateUserAchievement(selectedUser, achievementId, !currentStatus);
      
      // Update local state
      setUserAchievements(prev => ({
        ...prev,
        [achievementId]: !currentStatus
      }));
      
      setMessage(`Achievement ${!currentStatus ? 'unlocked' : 'locked'} for ${selectedUser}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) {
      setError('Please select a user to delete');
      return;
    }

    // Prevent deleting admin user
    if (isAdminUser(userToDelete)) {
      setError('Cannot delete admin user');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      await deleteUser(userToDelete);
      setMessage(`User ${userToDelete} has been deleted successfully`);
      setUserToDelete('');
      setShowDeleteConfirmation(false);
      
      // If current user was deleted, log them out
      if (userToDelete === currentUser.username) {
        setTimeout(() => {
          onLogout();
        }, 2000);
      }
      
      // Refresh the users list
      fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteUser = (username) => {
    // Prevent deleting admin user
    if (isAdminUser(username)) {
      setError('Cannot delete admin user');
      return;
    }

    // Warn if trying to delete current user
    if (username === currentUser.username) {
      setError('Warning: You are trying to delete your own account. This will log you out immediately.');
    }
    setUserToDelete(username);
    setShowDeleteConfirmation(true);
  };

  const filteredAchievements = achievements.filter(achievement =>
    achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading && users.length === 0) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="loading-spinner"></div>
          <p className={`mt-4 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <Header 
        currentUser={currentUser}
        onLogout={onLogout}
        title="Admin Panel"
        subtitle="User & Achievement Management"
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        {error && (
          <div className={`border rounded-lg p-4 mb-6 transition-colors duration-300 ${
            isDark 
              ? 'bg-red-500/20 border-red-500/30' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-red-200' : 'text-red-700'
            }`}>{error}</p>
          </div>
        )}

        {message && (
          <div className={`border rounded-lg p-4 mb-6 transition-colors duration-300 ${
            isDark 
              ? 'bg-green-500/20 border-green-500/30' 
              : 'bg-green-50 border-green-200'
          }`}>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-green-200' : 'text-green-700'
            }`}>{message}</p>
          </div>
        )}

        {/* User Selection and Search */}
        <div className={`rounded-xl p-6 mb-8 transition-all duration-300 ${
          isDark 
            ? 'glass-effect' 
            : 'bg-white/80 backdrop-blur-sm border border-white/20'
        }`}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white' 
                    : 'bg-white/80 border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Select a user...</option>
                {filteredUsers.map((user) => (
                  <option key={user.username} value={user.username}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
                isDark ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Search Achievements
              </label>
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-gray-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                dir="auto"
              />
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        {selectedUser && !isAdminUser(selectedUser) && (
          <div className={`rounded-xl p-6 mb-8 transition-all duration-300 ${
            isDark 
              ? 'glass-effect' 
              : 'bg-white/80 backdrop-blur-sm border border-white/20'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`} dir="auto">
              Manage Achievements for {selectedUser}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAchievements.map((achievement) => {
                const isUnlocked = userAchievements[achievement.id] || false;
                return (
                  <div
                    key={achievement.id}
                    className={`relative rounded-xl p-4 transition-all duration-200 ${
                      isUnlocked 
                        ? isDark 
                          ? 'bg-green-500/20 border border-green-500/30' 
                          : 'bg-green-100 border border-green-300'
                        : isDark 
                          ? 'bg-gray-500/20 border border-gray-500/30' 
                          : 'bg-gray-100 border border-gray-300'
                    } hover:scale-105`}
                  >
                    {/* Status Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      isUnlocked 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-500 text-white'
                    }`} dir="auto">
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </div>

                    {/* Achievement Image */}
                    <div className="flex justify-center mb-4">
                      <img
                        src={achievement.image_url}
                        alt={achievement.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.target.src = '/images/default-achievement.png';
                        }}
                      />
                    </div>

                    {/* Achievement Info */}
                    <div className="text-center mb-4">
                      <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`} dir="auto">
                        {achievement.name}
                      </h3>
                      <p className={`text-xs transition-colors duration-300 ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`} dir="auto">
                        {achievement.description}
                      </p>
                    </div>

                    {/* Toggle Button */}
                    <button
                      onClick={() => handleToggleAchievement(achievement.id)}
                      disabled={isLoading}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        isUnlocked
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Updating...
                        </div>
                      ) : (
                        <span dir="auto">{isUnlocked ? 'Lock Achievement' : 'Unlock Achievement'}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {filteredAchievements.length === 0 && (
              <div className="text-center py-8">
                <p className={`transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`} dir="auto">No achievements found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Admin User Notice */}
        {selectedUser && isAdminUser(selectedUser) && (
          <div className={`rounded-xl p-6 mb-8 transition-all duration-300 ${
            isDark 
              ? 'bg-yellow-500/20 border border-yellow-500/30' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Admin User Selected
            </h2>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-yellow-200' : 'text-yellow-700'
            }`}>
              The admin user cannot have achievements assigned or managed. Admin users are excluded from normal achievement tracking and statistics.
            </p>
          </div>
        )}

        {/* Delete User Section */}
        <div className={`rounded-xl p-6 transition-all duration-300 ${
          isDark 
            ? 'glass-effect' 
            : 'bg-white/80 backdrop-blur-sm border border-white/20'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>Delete User</h2>
          
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Select User to Delete
            </label>
            <select
              value={userToDelete}
              onChange={(e) => setUserToDelete(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 ${
                isDark 
                  ? 'bg-white/10 border-white/20 text-white' 
                  : 'bg-white/80 border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Select a user to delete...</option>
              {users.map((user) => (
                <option key={user.username} value={user.username}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => confirmDeleteUser(userToDelete)}
            disabled={isLoading || !userToDelete}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Delete User
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`rounded-xl p-8 max-w-md mx-4 transition-all duration-300 ${
              isDark 
                ? 'glass-effect' 
                : 'bg-white/95 backdrop-blur-sm border border-white/20'
            }`}>
              <h3 className={`text-xl font-bold mb-4 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`} dir="auto">Confirm User Deletion</h3>
              <p className={`mb-6 transition-colors duration-300 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`} dir="auto">
                Are you sure you want to delete user <strong className={isDark ? 'text-white' : 'text-gray-900'}>{userToDelete}</strong>? 
                This action will permanently remove the user and all their achievements. This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={handleDeleteUser}
                  disabled={isLoading}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete User'}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteConfirmation(false);
                    setUserToDelete('');
                  }}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className={`rounded-xl p-6 text-center transition-all duration-300 ${
            isDark 
              ? 'glass-effect' 
              : 'bg-white/80 backdrop-blur-sm border border-white/20'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{users.length}</div>
            <div className={`transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Total Users</div>
          </div>
          <div className={`rounded-xl p-6 text-center transition-all duration-300 ${
            isDark 
              ? 'glass-effect' 
              : 'bg-white/80 backdrop-blur-sm border border-white/20'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>{achievements.length}</div>
            <div className={`transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Total Achievements</div>
          </div>
          <div className={`rounded-xl p-6 text-center transition-all duration-300 ${
            isDark 
              ? 'glass-effect' 
              : 'bg-white/80 backdrop-blur-sm border border-white/20'
          }`}>
            <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>Admin</div>
            <div className={`transition-colors duration-300 ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Panel Access</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 