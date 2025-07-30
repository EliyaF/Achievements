import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const AchievementCard = ({ achievement }) => {
  const { id, name, description, image_url, unlocked } = achievement;
  const { isDark } = useTheme();

  return (
    <div className={`achievement-card rounded-xl p-4 transition-all duration-500 ${
      unlocked ? 'achievement-unlocked' : 'achievement-locked'
    }`}>
      <div className="flex flex-col items-center text-center space-y-2">
        {/* Achievement Image */}
        <div className="relative">
          <img
            src={image_url}
            alt={name}
            className={`w-32 h-32 rounded-full object-cover border-4 transition-all duration-500 ${
              unlocked 
                ? 'border-green-400 shadow-2xl shadow-green-400/50' 
                : isDark 
                  ? 'border-gray-500 opacity-60' 
                  : 'border-gray-400 opacity-70'
            }`}
          />
          {unlocked && (
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-green-500 rounded-full p-2 shadow-xl animate-pulse">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Achievement Info */}
        <div className="space-y-0.5">
          <h3 className={`text-lg font-bold transition-all duration-300 ${
            unlocked 
              ? isDark ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-lg'
              : isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {name}
          </h3>
          <p className={`text-sm transition-all duration-300 ${
            unlocked 
              ? isDark ? 'text-gray-100' : 'text-gray-700'
              : isDark ? 'text-gray-300' : 'text-gray-500'
          }`}>
            {description}
          </p>
        </div>

        {/* Status Badge */}
        <div className={`px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${
          unlocked
            ? isDark 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30'
              : 'bg-green-100 text-green-700 border border-green-300'
            : isDark 
              ? 'bg-gray-600/30 text-gray-400 border border-gray-500/30'
              : 'bg-gray-100 text-gray-600 border border-gray-300'
        }`}>
          {unlocked ? '✓ Unlocked' : '🔒 Locked'}
        </div>
      </div>
    </div>
  );
};

export default AchievementCard; 