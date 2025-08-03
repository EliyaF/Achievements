import React, { useState, useEffect } from 'react';
import { getUserAchievements } from '../services/api';
import AchievementCard from './AchievementCard';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

const Achievements = ({ currentUser, onLogout, isLoading, setIsLoading }) => {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, unlocked, locked
  const [searchTerm, setSearchTerm] = useState('');
  const { isDark } = useTheme();



  useEffect(() => {
    fetchAchievements();
  }, [currentUser]);

  const fetchAchievements = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getUserAchievements(currentUser.username);
      setAchievements(data.achievements);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  // Filter achievements based on current filter and search
  const filteredAchievements = achievements.filter(achievement => {
    const matchesFilter = filter === 'all' || 
      (filter === 'unlocked' && achievement.unlocked) ||
      (filter === 'locked' && !achievement.unlocked);
    
    const matchesSearch = achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="relative">
            <div className={`w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin ${
              isDark ? 'border-purple-500' : 'border-blue-500'
            }`}></div>
            <div className={`absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin ${
              isDark ? 'border-blue-500' : 'border-purple-500'
            }`} style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className={`mt-6 text-lg font-medium transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>Loading your achievements...</p>
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
        title="Achievements"
        subtitle={`${unlockedCount}/${totalCount} Unlocked`}
      />

      {/* Progress Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <div className={`w-full rounded-full h-1.5 overflow-hidden transition-colors duration-300 ${
              isDark ? 'bg-white/10' : 'bg-gray-200'
            }`}>
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-1.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className={`text-xs whitespace-nowrap transition-colors duration-300 ${
            isDark ? 'text-purple-200' : 'text-purple-700'
          }`}>
            {unlockedCount}/{totalCount}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full border rounded-xl px-4 py-3 placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-purple-200' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm'
                }`}
              />
              <div className="absolute right-3 top-3">
                <svg className={`w-5 h-5 transition-colors duration-300 ${
                  isDark ? 'text-purple-200' : 'text-purple-600'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            {[
              { key: 'all', label: 'All', count: achievements.length },
              { key: 'unlocked', label: 'Unlocked', count: unlockedCount },
              { key: 'locked', label: 'Locked', count: totalCount - unlockedCount }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  filter === key
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : isDark
                      ? 'bg-white/10 text-purple-200 hover:bg-white/20'
                      : 'bg-white/80 text-purple-700 hover:bg-white shadow-sm border border-gray-200'
                }`}
              >
                {label} ({count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className={`border rounded-xl p-4 transition-colors duration-300 ${
            isDark 
              ? 'bg-red-500/20 border-red-500/30' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-red-200' : 'text-red-700'
            }`}>{error}</p>
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {filteredAchievements.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                onRefresh={fetchAchievements}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🎯</div>
            <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {searchTerm ? 'No achievements found' : 'No achievements available'}
            </h3>
            <p className={`transition-colors duration-300 ${
              isDark ? 'text-purple-200' : 'text-purple-700'
            }`}>
              {searchTerm 
                ? `No achievements match "${searchTerm}"`
                : 'Achievements will appear here once they\'re configured.'
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2 rounded-xl transition-all duration-200"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements; 