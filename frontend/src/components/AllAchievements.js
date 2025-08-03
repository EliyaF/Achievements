import React, { useState, useEffect } from 'react';
import { getAllAchievements } from '../services/api';
import Header from './Header';
import { useTheme } from '../contexts/ThemeContext';

const AllAchievements = ({ currentUser, onLogout, isLoading, setIsLoading }) => {
  const [achievements, setAchievements] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { isDark } = useTheme();

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAllAchievements();
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAchievements = achievements.filter(achievement =>
    achievement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          }`}>Loading achievements...</p>
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
            onClick={fetchAchievements}
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
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
        title="All Achievements"
        subtitle="Complete list of all available achievements"
      />

      {/* Search and Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search Bar */}
        <div className="mb-8">
          <div className={`relative max-w-md mx-auto ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border border-transparent rounded-xl text-sm leading-5 transition-all duration-300 ${
                isDark 
                  ? 'bg-slate-800/50 text-white placeholder-gray-400 focus:bg-slate-700/50 focus:border-purple-500' 
                  : 'bg-white/80 text-gray-900 placeholder-gray-500 focus:bg-white focus:border-purple-500'
              } focus:outline-none focus:ring-2 focus:ring-purple-500/20`}
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mb-8">
          <div className={`backdrop-blur-sm border rounded-2xl p-6 transition-all duration-300 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20 border-purple-500/30' 
              : 'bg-white/90 border-purple-200 shadow-lg'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500 mb-2">{achievements.length}</div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Total Achievements</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500 mb-2">
                  {achievements.filter(a => a.unlock_count > 0).length}
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Unlocked by Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500 mb-2">
                  {achievements.length > 0 ? Math.round((achievements.filter(a => a.unlock_count > 0).length / achievements.length) * 100) : 0}%
                </div>
                <div className={`text-sm transition-colors duration-300 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Completion Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Grid - 2 per row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className={`group relative overflow-hidden backdrop-blur-sm border rounded-3xl p-6 transition-all duration-700 hover:scale-[1.03] hover:shadow-2xl ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-800/60 via-slate-700/60 to-slate-800/60 border-slate-600/40 hover:border-purple-500/60 hover:bg-gradient-to-br hover:from-slate-700/70 hover:via-purple-900/20 hover:to-slate-700/70' 
                  : achievement.unlock_count > 0
                    ? 'bg-gradient-to-br from-green-50/95 via-emerald-50/95 to-green-50/95 border-green-300/80 shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-green-50 hover:via-emerald-50/50 hover:to-green-50 border-green-400/60'
                    : 'bg-gradient-to-br from-white/95 via-gray-50/95 to-white/95 border-gray-200/80 shadow-xl hover:shadow-2xl hover:bg-gradient-to-br hover:from-white hover:via-purple-50/30 hover:to-white'
              }`}
              style={{
                animationDelay: `${index * 0.1}s`,
                animation: 'fadeInUp 0.8s ease-out forwards'
              }}
            >
              {/* Decorative background elements */}
              <div className={`absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-700 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                  : achievement.unlock_count > 0
                    ? 'bg-gradient-to-br from-green-400 to-emerald-400'
                    : 'bg-gradient-to-br from-purple-400 to-blue-400'
              }`}></div>
              
              {/* Glow effect on hover */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-500/20 to-blue-500/20' 
                  : achievement.unlock_count > 0
                    ? 'bg-gradient-to-br from-green-400/20 to-emerald-400/20'
                    : 'bg-gradient-to-br from-purple-400/20 to-blue-400/20'
              }`}></div>

              {/* Main Content Area - Horizontal Layout */}
              <div className="relative flex items-start space-x-4">
                {/* Left: Achievement Image - Bigger */}
                <div className="flex-shrink-0">
                  <div className={`relative w-36 h-36 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${
                    isDark ? 'shadow-purple-500/20' : 'shadow-purple-500/30'
                  }`}>
                    {/* Image glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                    
                    {achievement.image_url ? (
                      <img 
                        src={achievement.image_url} 
                        alt={achievement.name}
                        className="relative w-full h-full object-cover transition-transform duration-500 group-hover:scale-125"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="relative w-full h-full flex items-center justify-center text-white text-5xl" style={{ display: achievement.image_url ? 'none' : 'flex' }}>
                      🏆
                    </div>
                    
                    {/* Shine effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]`}></div>
                  </div>
                </div>

                {/* Right: Achievement Title and Description - Left Aligned */}
                <div className="flex-1 min-w-0 text-left pt-2">
                  <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`} dir="auto">
                    {achievement.name}
                  </h3>
                  <p className={`text-lg leading-relaxed transition-colors duration-300 line-clamp-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-600'
                  }`} dir="auto">
                    {achievement.description}
                  </p>
                  
                  {/* Unlock indicator */}
                  {achievement.unlock_count > 0 && (
                    <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors duration-300 ${
                      isDark 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-green-100 text-green-700 border border-green-300'
                    }`}>
                      <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {achievement.unlock_count} user{achievement.unlock_count !== 1 ? 's' : ''} unlocked
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Bar - Full width at bottom */}
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-semibold transition-colors duration-300 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Popularity
                    </span>
                    <span className={`font-bold transition-colors duration-300 ${
                      isDark ? 'text-purple-300' : 'text-purple-600'
                    }`}>
                      {achievement.popularity_percentage || 0}%
                    </span>
                  </div>
                  <div className={`relative w-full h-3 rounded-full overflow-hidden transition-colors duration-300 ${
                    isDark ? 'bg-slate-700/50' : 'bg-gray-200/80'
                  }`}>
                    {/* Progress bar glow */}
                    <div className={`absolute inset-0 rounded-full opacity-20 ${
                      isDark ? 'bg-gradient-to-r from-purple-500 to-blue-500' : 'bg-gradient-to-r from-purple-400 to-blue-400'
                    }`}></div>
                    
                    <div
                      className={`relative h-full rounded-full transition-all duration-700 ease-out ${
                        isDark 
                          ? 'bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600' 
                          : 'bg-gradient-to-r from-purple-500 via-blue-500 to-purple-600'
                      }`}
                      style={{ 
                        width: `${achievement.popularity_percentage || 0}%`,
                        animation: 'progressFill 1.2s ease-out'
                      }}
                    ></div>
                    
                    {/* Progress bar shine */}
                    <div className={`absolute inset-0 rounded-full opacity-30 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-100%] animate-pulse`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredAchievements.length === 0 && searchTerm && (
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg font-medium">No achievements found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}

        {/* Empty State */}
        {filteredAchievements.length === 0 && !searchTerm && (
          <div className={`text-center py-12 transition-colors duration-300 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <div className="text-4xl mb-4">🏆</div>
            <p className="text-lg font-medium">No achievements available</p>
            <p className="text-sm">Check back later for new achievements</p>
          </div>
        )}
      </div>

             {/* Custom CSS for animations */}
       <style jsx>{`
         @keyframes fadeInUp {
           from {
             opacity: 0;
             transform: translateY(30px) scale(0.95);
           }
           to {
             opacity: 1;
             transform: translateY(0) scale(1);
           }
         }
         
         @keyframes progressFill {
           from {
             width: 0%;
           }
           to {
             width: var(--progress-width);
           }
         }
         
         @keyframes shine {
           0% {
             transform: translateX(-100%) skewX(-12deg);
           }
           100% {
             transform: translateX(100%) skewX(-12deg);
           }
         }
         
                                       .line-clamp-3 {
             display: -webkit-box;
             -webkit-line-clamp: 3;
             -webkit-box-orient: vertical;
             overflow: hidden;
           }
         
         .group:hover .shine-effect {
           animation: shine 1.5s ease-in-out;
         }
       `}</style>
    </div>
  );
};

export default AllAchievements; 