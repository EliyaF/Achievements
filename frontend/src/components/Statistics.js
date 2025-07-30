import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStatistics, getUserStatistics } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const Statistics = ({ currentUser, onLogout, isLoading, setIsLoading }) => {
  const [statistics, setStatistics] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('rankings');
  const { isDark } = useTheme();

  useEffect(() => {
    fetchStatistics();
  }, [currentUser]);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError('');

    try {
      const [statsData, userStatsData] = await Promise.all([
        getStatistics(),
        getUserStatistics(currentUser.username)
      ]);
      setStatistics(statsData);
      setUserStats(userStatsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          }`}>Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">⚠️</div>
          <p className={`text-lg transition-colors duration-300 ${
            isDark ? 'text-white' : 'text-gray-800'
          }`}>{error}</p>
          <button
            onClick={fetchStatistics}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!statistics || !userStats) {
    return null;
  }

  const { overall_stats, user_rankings, achievement_popularity, most_popular_achievement, least_popular_achievement } = statistics;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
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
                  <span className="text-xl">📊</span>
                </div>
                <div>
                  <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>Statistics</h1>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-purple-200' : 'text-purple-700'
                  }`}>Achievement Analytics & Rankings</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/achievements"
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
              >
                ← Back
              </Link>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition-all duration-200 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex space-x-1 p-1 rounded-xl transition-colors duration-300 ${
          isDark ? 'bg-slate-800/50' : 'bg-white/80 shadow-sm border border-gray-200'
        }`}>
          {[
            { id: 'rankings', label: 'User Rankings', icon: '🏆' },
            { id: 'achievements', label: 'Achievement Stats', icon: '🎯' },
            { id: 'personal', label: 'My Stats', icon: '👤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : isDark 
                    ? 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">

        {activeTab === 'rankings' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
                : 'bg-white/90 border-purple-200 shadow-lg'
            }`}>
              <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>User Rankings</h3>
              <div className="space-y-4">
                {user_rankings.map((user, index) => (
                  <div
                    key={user.username}
                    className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                      user.username === currentUser.username
                        ? isDark 
                          ? 'bg-gradient-to-r from-purple-500/30 to-blue-500/30 border border-purple-400/50'
                          : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 shadow-md'
                        : isDark 
                          ? 'bg-slate-800/50 hover:bg-slate-700/50'
                          : 'bg-white/80 hover:bg-white shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-500 text-black' :
                        isDark ? 'bg-slate-600 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className={`font-medium transition-colors duration-300 ${
                          user.username === currentUser.username 
                            ? isDark ? 'text-purple-300' : 'text-purple-700'
                            : isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {user.username}
                          {user.username === currentUser.username && ' (You)'}
                        </p>
                        <p className={`text-sm transition-colors duration-300 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {user.achievements_count}/{user.total_achievements} achievements
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>{user.completion_percentage}%</p>
                      <div className={`w-24 h-2 rounded-full overflow-hidden transition-colors duration-300 ${
                        isDark ? 'bg-slate-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                          style={{ width: `${user.completion_percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
                : 'bg-white/90 border-purple-200 shadow-lg'
            }`}>
              <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`} dir="auto">Achievement Popularity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievement_popularity.slice(0, 9).map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-4 hover:scale-105 transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-800/50 hover:bg-slate-700/50' 
                        : 'bg-white/80 hover:bg-white shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-500 text-black' :
                        isDark ? 'bg-slate-600 text-white' : 'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <h4 className={`font-medium text-sm transition-colors duration-300 ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`} dir="auto">{achievement.name}</h4>
                    </div>
                    <p className={`text-xs mb-3 transition-colors duration-300 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`} dir="auto">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium transition-colors duration-300 ${
                        isDark ? 'text-purple-300' : 'text-purple-700'
                      }`}>
                        {achievement.unlock_count} users
                      </span>
                      <span className={`text-sm transition-colors duration-300 ${
                        isDark ? 'text-blue-300' : 'text-blue-600'
                      }`}>
                        {achievement.popularity_percentage}%
                      </span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden mt-2 transition-colors duration-300 ${
                      isDark ? 'bg-slate-700' : 'bg-gray-200'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: `${achievement.popularity_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <div className="space-y-6">
            {/* Personal Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
                  : 'bg-white/90 border-purple-200 shadow-lg'
              }`}>
                <div>
                  <div className="text-4xl mb-2">🏆</div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-purple-200' : 'text-purple-700'
                  }`} dir="auto">Your Achievements</p>
                  <p className={`text-3xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{userStats.achievements_count}</p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} dir="auto">out of {userStats.total_achievements}</p>
                </div>
              </div>
              
              <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
                  : 'bg-white/90 border-green-200 shadow-lg'
              }`}>
                <div>
                  <div className="text-4xl mb-2">📊</div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-green-200' : 'text-green-700'
                  }`} dir="auto">Completion</p>
                  <p className={`text-3xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>{userStats.completion_percentage}%</p>
                  <div className={`w-full h-2 rounded-full overflow-hidden mt-2 transition-colors duration-300 ${
                    isDark ? 'bg-slate-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                      style={{ width: `${userStats.completion_percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
                isDark 
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                  : 'bg-white/90 border-yellow-200 shadow-lg'
              }`}>
                <div>
                  <div className="text-4xl mb-2">🥇</div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${
                    isDark ? 'text-yellow-200' : 'text-yellow-700'
                  }`} dir="auto">Your Rank</p>
                  <p className={`text-3xl font-bold transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>#{userStats.rank}</p>
                  <p className={`text-sm transition-colors duration-300 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} dir="auto">out of {userStats.total_users} users</p>
                </div>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
              isDark 
                ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
                : 'bg-white/90 border-purple-200 shadow-lg'
            }`}>
              <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`} dir="auto">Your Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {userStats.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`rounded-xl p-4 hover:scale-105 transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-800/50 hover:bg-slate-700/50' 
                        : 'bg-white/80 hover:bg-white shadow-sm border border-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-sm">✓</span>
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className={`font-medium text-sm transition-colors duration-300 ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`} dir="auto">{achievement.name}</h4>
                        <p className={`text-xs transition-colors duration-300 ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`} dir="auto">{achievement.description}</p>
                      </div>
                    </div>
                    <p className={`text-xs transition-colors duration-300 ${
                      isDark ? 'text-purple-300' : 'text-purple-700'
                    }`} dir="auto">
                      Unlocked: {new Date(achievement.unlocked_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics; 