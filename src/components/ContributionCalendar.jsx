import React, { useState, useEffect, useRef } from 'react';
import { CalendarIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const ContributionCalendar = ({ username, darkMode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef(null);
  const chartUrlRef = useRef('');
  
  // Update the chart URL only when username changes
  useEffect(() => {
    if (!username) return;
    
    // Reset states when username changes
    setLoading(true);
    setError(false);
    setRetryCount(0);
    
    // Use more distinct colors for dark/light mode that match our design
    const themeColor = darkMode ? '60a5fa' : '3b82f6';
    chartUrlRef.current = `https://ghchart.rshah.org/${themeColor}/${username}`;
    
    // If we already have an image element, update its src
    if (imgRef.current) {
      imgRef.current.src = chartUrlRef.current;
    }
  }, [username, darkMode]);

  const handleRetry = () => {
    if (retryCount < 3) {
      setLoading(true);
      setError(false);
      setRetryCount(prev => prev + 1);
      
      // Force reload the image
      if (imgRef.current) {
        const newUrl = `${chartUrlRef.current}?retry=${Date.now()}`;
        imgRef.current.src = newUrl;
      }
    }
  };

  if (!username) {
    return null;
  }

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg border ${
      darkMode ? 'bg-surface border-border' : 'bg-white border-gray-100'
    }`}>
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className={`w-6 h-6 mr-3 ${darkMode ? 'text-primary-light' : 'text-primary'}`} />
            <h2 className="text-xl md:text-2xl font-display font-bold text-text">
              Contribution Activity
            </h2>
          </div>
          
          {error && retryCount < 3 && (
            <button 
              onClick={handleRetry}
              className={`flex items-center text-sm px-3 py-1 rounded-full ${
                darkMode ? 'bg-surface hover:bg-gray-800 text-primary-light' : 'bg-gray-100 hover:bg-gray-200 text-primary'
              }`}
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Retry
            </button>
          )}
        </div>
        <p className="mt-1 text-text-secondary text-sm ml-9">
          GitHub contribution calendar showing activity over the past year
        </p>
      </div>
      
      {/* Chart container */}
      <div className={`px-6 py-4 ${darkMode ? 'bg-surface/50' : 'bg-gray-50/50'}`}>
        <div className="flex justify-center overflow-x-auto">
          <div className={`relative min-w-full rounded-lg ${darkMode ? 'bg-surface p-3' : 'bg-white/80 p-3 shadow-sm'}`}>
            {/* Loading skeleton */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
                  <div className="text-text-secondary text-sm">Loading contribution data...</div>
                </div>
              </div>
            )}
            
            {/* Actual contribution chart */}
            <img 
              ref={imgRef}
              src={chartUrlRef.current}
              alt={`${username}'s GitHub contribution calendar`}
              className={`w-full relative z-20 transition-opacity duration-300 rounded ${loading ? 'opacity-30' : darkMode ? 'opacity-90' : 'opacity-100'}`}
              onLoad={() => {
                setLoading(false);
              }}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              style={{ display: error ? 'none' : 'block' }}
            />
            
            {/* Fallback message for no contributions or errors */}
            {error && (
              <div className={`flex flex-col items-center justify-center p-8 text-center h-40 ${
                darkMode ? 'text-text-secondary' : 'text-gray-500'
              }`}>
                <svg className="w-12 h-12 mb-3 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-9a1 1 0 011 1v3a1 1 0 01-2 0V8a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <p className="text-lg font-medium">No contribution data available</p>
                <p className="text-sm mt-2 max-w-md">
                  This could be due to a new account, private contributions, or GitHub API limitations.
                  {retryCount >= 3 && " We've tried multiple times but couldn't retrieve the data."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Legend for contribution levels */}
      <div className={`px-6 py-4 flex justify-between items-center text-sm border-t ${
        darkMode ? 'border-border text-text-secondary' : 'border-gray-100 text-gray-500'
      }`}>
        <div>Less</div>
        <div className="flex gap-1.5">
          {[0, 1, 2, 3, 4].map((level) => (
            <div 
              key={level}
              className={`w-4 h-4 rounded transition-transform hover:scale-110 ${
                level === 0 ? `${darkMode ? 'border border-border bg-surface/80' : 'border border-gray-200 bg-white'}` : ''
              }`} 
              style={{ 
                backgroundColor: level === 0 ? '' : darkMode 
                  ? `rgba(96, 165, 250, ${level * 0.25})` 
                  : `rgba(59, 130, 246, ${level * 0.25})` 
              }}
            ></div>
          ))}
        </div>
        <div>More</div>
      </div>
    </div>
  );
};

export default ContributionCalendar; 